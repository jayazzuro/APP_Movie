const { Server } = require("socket.io");
let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("Khách hàng mới được kết nối", socket.id);

    socket.on("sendComment", (data) => {
      io.emit("newComment", data);
    });

    socket.on("disconnection", () => {});
  });
};

const getIo = () => {
  if (!io) throw new Error("Socket.io chưa được init!");
  return io;
};

module.exports = {
  initSocket,
  getIo,
};
