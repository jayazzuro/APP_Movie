import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  late IO.Socket _socket;

  void connect(Function(Map<String, dynamic>) onNewComment) {
    _socket = IO.io(
      "http://10.50.1.153:8888",
      IO.OptionBuilder().setTransports(['websocket']).build(),
    );

    _socket.onConnect((_) {
      print(" Socket connected");
    });

    // Nhận comment mới từ server
    _socket.on("newComment", (data) {
      print(" Comment received: $data");
      onNewComment(Map<String, dynamic>.from(data));
    });
  }

  void sendComment(Map<String, dynamic> commentData) {
    _socket.emit("sendComment", commentData);
  }

  void disconnect() {
    _socket.disconnect();
  }
}
