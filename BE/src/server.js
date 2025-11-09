require("dotenv").config();
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const webRouterUser = require("./routes/movie_user");
const webRouterAdmin = require("./routes/movie_admin");
const path = require("path");
const { initSocket } = require("./services/socket");
const http = require("http");

const app = express();
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;
const server = http.createServer(app);

// config template engine
configViewEngine(app);

// Khai báo hình ảnh
app.use("/img", express.static(path.join(__dirname, "public", "img")));

// Khai báo route
app.use("/", webRouterUser);
app.use("/api/auth", webRouterAdmin);

// Khởi tạo socket
initSocket(server);

app.listen(port, hostname, () => {
  console.log(`http://localhost:${port}/api`);
});
