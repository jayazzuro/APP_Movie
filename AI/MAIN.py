import time
import psycopg2
from sentence_transformers import SentenceTransformer
from functools import lru_cache
from fastapi import FastAPI, Query
import os
from dotenv import load_dotenv


load_dotenv() 
model = SentenceTransformer("BAAI/bge-large-en-v1.5")

app = FastAPI()


@lru_cache(maxsize=500)
def get_embedding(text: str):
    return model.encode(text, normalize_embeddings=True).tolist()


# Kết nối database (PostgreSQL)
def get_connection():
    return psycopg2.connect(
          host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )


@app.get("/search")
def search_movies(keyword: str = Query(..., description="Từ khóa tìm phim")):
    query_text = f"Tìm phim về {keyword}"
    query_emb = get_embedding(query_text)

    conn = get_connection()
    cur = conn.cursor()

    start_time = time.time()

    cur.execute("""
        WITH ann AS (
            SELECT idmv, "TenPhim", "TheLoai", "MoTa", "HinhAnh", "Rate", embedding
            FROM movies
            ORDER BY embedding <=> %s::vector
            LIMIT 100
        )
        SELECT idmv, "TenPhim", "TheLoai", "MoTa", "HinhAnh", "Rate",
               embedding <=> %s::vector AS distance,
               (
                   unaccent("TenPhim") ILIKE unaccent(%s) OR 
                   unaccent("MoTa") ILIKE unaccent(%s) OR
                   similarity(unaccent("TheLoai"), unaccent(%s)) > 0.3
               ) AS keyword_match,
               (
                   (embedding <=> %s::vector) * 0.6
                   - (similarity(unaccent("TenPhim"), unaccent(%s))
                      + similarity(unaccent("MoTa"), unaccent(%s))
                      + similarity(unaccent("TheLoai"), unaccent(%s))) * 0.2
                   - (CASE WHEN (
                       unaccent("TenPhim") ILIKE unaccent(%s) OR 
                       unaccent("MoTa") ILIKE unaccent(%s) OR
                       similarity(unaccent("TheLoai"), unaccent(%s)) > 0.3
                     ) THEN 0.2 ELSE 0 END)
               ) AS rank_score
        FROM ann
        ORDER BY rank_score ASC
        LIMIT 10;
    """, (
        query_emb, query_emb,
        f"%{keyword}%", f"%{keyword}%", keyword,
        query_emb, keyword, keyword, keyword,
        f"%{keyword}%", f"%{keyword}%", keyword
    ))

    results = cur.fetchall()
    end_time = time.time()

    cur.close()
    conn.close()

    # Map dữ liệu
    output = [
        {
            "idmv": r[0],
            "TenPhim": r[1],
            "TheLoai": r[2],
            "MoTa": r[3],
            "HinhAnh": r[4],
            "Rate": float(r[5]) if r[5] is not None else 0.0,
            "distance": float(r[6]),
            "keyword_match": bool(r[7]),
            "rank_score": float(r[8]),
        }
        for r in results
    ]

    return {
        "results": output,
        "time_ms": round((end_time - start_time) * 1000, 2)
    }
