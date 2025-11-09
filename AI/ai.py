import psycopg2
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
import ast
from numpy.linalg import norm
from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv() 
# ==============================
# 1. Hàm kết nối DB
# ==============================
def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )

# ==============================
# 2. Load embedding từ DB
# ==============================
def parse_vector(v):
    if isinstance(v, list):
        return np.array(v, dtype=np.float32)
    elif isinstance(v, str):
        v = v.strip("[]")
        return np.array([float(x) for x in v.split(",")], dtype=np.float32)
    else:
        raise ValueError(f"Unexpected type for vector: {type(v)}")

def load_embeddings_from_db():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT user_id, embedding FROM user_embeddings;")
    user_rows = cur.fetchall()
    user_emb = {r[0]: parse_vector(r[1]) for r in user_rows}

    cur.execute("SELECT movie_id, embedding FROM movie_embeddings;")
    movie_rows = cur.fetchall()
    movie_emb = {r[0]: parse_vector(r[1]) for r in movie_rows}

    cur.close(); conn.close()
    return user_emb, movie_emb

# ==============================
# 3. Kiểm tra DB có embedding chưa
# ==============================
try:
    user_emb_db, movie_emb_db = load_embeddings_from_db()
    if user_emb_db and movie_emb_db:
        print(f"✅ Load {len(user_emb_db)} user_emb, {len(movie_emb_db)} movie_emb từ DB")
        need_train = False
    else:
        need_train = True
except Exception as e:
    print("⚠️ Chưa có bảng embedding:", e)
    need_train = True

# ==============================
# 4. Nếu chưa có → Train
# ==============================
if need_train:
    print(" Bắt đầu train model vì chưa có embedding...")

    conn = get_conn()
    cur = conn.cursor()

    cur.execute('SELECT idmv, embedding FROM movies WHERE embedding IS NOT NULL;')
    movie_rows = cur.fetchall()
    movie_content_emb = {r[0]: np.array(ast.literal_eval(r[1]), dtype=np.float32) for r in movie_rows}

    cur.execute("""
        SELECT wh."idKH", wh.idmv, 
               COALESCE(
                   CASE WHEN wh.rating >= 6 THEN 1 ELSE 0 END,
                   CASE WHEN wh.progress > 0.5 THEN 1 ELSE 0 END
               ) as label
        FROM watch_history wh
        WHERE wh.idmv IS NOT NULL
    """)
    rows = cur.fetchall()
    cur.close(); conn.close()
    print(f" Lấy {len(rows)} records từ watch_history")

    user_ids = list({r[0] for r in rows})
    movie_ids = list({r[1] for r in rows})
    user2idx = {uid: i for i, uid in enumerate(user_ids)}
    movie2idx = {mid: i for i, mid in enumerate(movie_ids)}

    data = []
    for uid, mid, label in rows:
        if mid not in movie_content_emb:
            continue
        data.append((user2idx[uid], movie2idx[mid], float(label), movie_content_emb[mid]))

    class HybridDataset(Dataset):
        def __init__(self, data): self.data = data
        def __len__(self): return len(self.data)
        def __getitem__(self, idx):
            u, m, y, emb = self.data[idx]
            return (
                torch.tensor(u),
                torch.tensor(m),
                torch.tensor(emb, dtype=torch.float32),
                torch.tensor(y, dtype=torch.float32)
            )

    dataset = HybridDataset(data)
    loader = DataLoader(dataset, batch_size=64, shuffle=True)

    n_users = len(user2idx)
    n_movies = len(movie2idx)
    embed_dim = 32
    content_dim = len(next(iter(movie_content_emb.values())))

    class HybridNCF(nn.Module):
        def __init__(self, n_users, n_movies, embed_dim, content_dim):
            super().__init__()
            self.user_embed = nn.Embedding(n_users, embed_dim)
            self.movie_embed = nn.Embedding(n_movies, embed_dim)
            self.fc = nn.Sequential(
                nn.Linear(embed_dim*2 + content_dim, 256),
                nn.ReLU(),
                nn.Linear(256, 128),
                nn.ReLU(),
                nn.Linear(128, 1),
                nn.Sigmoid()
            )
        def forward(self, user, movie, content):
            u = self.user_embed(user)
            m = self.movie_embed(movie)
            x = torch.cat([u, m, content], dim=-1)
            return self.fc(x)

    model = HybridNCF(n_users, n_movies, embed_dim, content_dim)
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    for epoch in range(5):
        total_loss = 0
        for user, movie, content, label in loader:
            optimizer.zero_grad()
            output = model(user, movie, content).view(-1)
            loss = criterion(output, label)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch+1}, Loss={total_loss:.4f}")

    user_embeddings = model.user_embed.weight.data.numpy()
    movie_embeddings = model.movie_embed.weight.data.numpy()

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS user_embeddings (
            user_id INT PRIMARY KEY,
            embedding VECTOR(32)
        )
    """)
    for uid, idx in user2idx.items():
        emb = user_embeddings[idx].tolist()
        cur.execute("""
            INSERT INTO user_embeddings (user_id, embedding)
            VALUES (%s, %s)
            ON CONFLICT (user_id) DO UPDATE SET embedding = EXCLUDED.embedding;
        """, (uid, emb))

    cur.execute("""
        CREATE TABLE IF NOT EXISTS movie_embeddings (
            movie_id INT PRIMARY KEY,
            embedding VECTOR(32)
        )
    """)
    for mid, idx in movie2idx.items():
        emb = movie_embeddings[idx].tolist()
        cur.execute("""
            INSERT INTO movie_embeddings (movie_id, embedding)
            VALUES (%s, %s)
            ON CONFLICT (movie_id) DO UPDATE SET embedding = EXCLUDED.embedding;
        """, (mid, emb))

    conn.commit()
    cur.close(); conn.close()
    print(" Đã lưu user + movie embedding vào PostgreSQL.")

    user_emb_db, movie_emb_db = load_embeddings_from_db()

# ==============================
# 5. Recommend function
# ==============================
def recommend_from_db(user_real_id, top_k=5):
    if user_real_id not in user_emb_db:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT idmv, "TenPhim", "Rate", "HinhAnh"
            FROM movies ORDER BY "Rate" DESC LIMIT %s
        """, (top_k,))
        res = [(r[0], r[1], r[2], r[3], 1.0) for r in cur.fetchall()]
        cur.close(); conn.close()
        return res

    uvec = user_emb_db[user_real_id]
    scores = []
    for mid, mvec in movie_emb_db.items():
        score = np.dot(uvec, mvec) / (norm(uvec) * norm(mvec) + 1e-8)
        scores.append((mid, score))

    top_movies = sorted(scores, key=lambda x: x[1], reverse=True)[:top_k]
    movie_ids_recommend = [mid for mid, _ in top_movies]

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT idmv, "TenPhim", "Rate", "HinhAnh"
        FROM movies WHERE idmv = ANY(%s);
    """, (movie_ids_recommend,))
    movie_info = {r[0]: (r[1], r[2], r[3]) for r in cur.fetchall()}
    cur.close(); conn.close()

    results = []
    for mid, score in top_movies:
        if mid in movie_info:
            tenphim, rate, hinhanh = movie_info[mid]
            results.append((mid, tenphim, rate, hinhanh, score))
    return results

# ==============================
# 6. FastAPI
# ==============================
app = FastAPI()

@app.get("/recommend/{user_id}")
def get_recommend(user_id: int, top_k: int = 5):
    results = recommend_from_db(user_id, top_k)
    movies = []
    for r in results:
        movies.append({
            "idmv": r[0],
            "TenPhim": r[1],
            "Rate": r[2],
            "HinhAnh": r[3],
            "Score": float(r[4])
        })
    return {"success": True, "data": movies}

# ==============================
# 7. Run server
# ==============================
if __name__ == "__main__":
    uvicorn.run("ai:app", host="0.0.0.0", port=5000, reload=True)
