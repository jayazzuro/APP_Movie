import 'package:flutter/material.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../services/comment_service.dart';
import '../services/socket_service.dart';
import '../utils/shared_pref.dart';

class YoutubeWithCommentsScreen extends StatefulWidget {
  final String youtubeUrl;
  final int idmv;

  const YoutubeWithCommentsScreen({
    super.key,
    required this.youtubeUrl,
    required this.idmv,
  });

  @override
  State<YoutubeWithCommentsScreen> createState() =>
      _YoutubeWithCommentsScreenState();
}

class _YoutubeWithCommentsScreenState extends State<YoutubeWithCommentsScreen> {
  late YoutubePlayerController _controller;
  final SocketService _socketService = SocketService();
  List<Map<String, dynamic>> _comments = [];
  String? _idKH;
  final TextEditingController _commentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final videoId = YoutubePlayerController.convertUrlToId(widget.youtubeUrl);
    _controller = YoutubePlayerController.fromVideoId(
      videoId: videoId ?? "",
      autoPlay: false,
      params: const YoutubePlayerParams(
        showControls: true,
        enableCaption: true,
        showFullscreenButton: true,
      ),
    );

    _loadUserId();
    _initSocket();
  }

  Future<void> _loadUserId() async {
    final id = await SharedPref.getUserId();
    if (!mounted) return;
    setState(() => _idKH = id);
    await _fetchComments();
  }

  void _initSocket() {
    _socketService.connect((data) {
      if (!mounted) return;
      setState(() {
        _comments.add(Map<String, dynamic>.from(data));
      });
    });
  }

  Future<void> _fetchComments() async {
    try {
      final comments = await CommentService.getComments(widget.idmv);
      if (!mounted) return;
      setState(() {
        _comments = List<Map<String, dynamic>>.from(comments);
      });
    } catch (e) {
      print("Error fetching comments: $e");
    }
  }

  Future<void> _sendComment() async {
    final text = _commentController.text.trim();
    if (text.isEmpty || _idKH == null) return;

    try {
      final intIdKH = int.tryParse(_idKH!);
      if (intIdKH == null) return;

      await CommentService.postComment(text, intIdKH, widget.idmv);

      if (!mounted) return;

      setState(() {
        _comments.add({
          "idmv": widget.idmv,
          "idKH": intIdKH,
          "text": text,
          "createdAt": DateTime.now().toIso8601String(),
        });
      });

      _socketService.sendComment({
        "idmv": widget.idmv,
        "idKH": intIdKH,
        "text": text,
      });

      _commentController.clear();
    } catch (e) {
      print("Error sending comment: $e");
    }
  }

  @override
  void dispose() {
    _controller.close();
    _socketService.disconnect();
    _commentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return YoutubePlayerScaffold(
      controller: _controller,
      builder: (context, player) {
        return Scaffold(
          appBar: AppBar(title: const Text("Watch & Comment")),
          body: Column(
            children: [
              SizedBox(
                height: MediaQuery.of(context).size.height * 0.33,
                width: double.infinity,
                child: player,
              ),

              Expanded(
                child: ListView.builder(
                  itemCount: _comments.length,
                  itemBuilder: (context, index) {
                    final cmt = _comments[index];
                    String timeAgo = "";

                    if (cmt["createdAt"] != null) {
                      try {
                        final createdAt = DateTime.parse(cmt["createdAt"]);
                        timeAgo = timeago.format(createdAt, locale: "vi");
                      } catch (_) {}
                    }

                    return ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.green,
                        child: Text(
                          (cmt["idKH"]?.toString()[0] ?? "?").toUpperCase(),
                          style: const TextStyle(color: Colors.white),
                        ),
                      ),
                      title: Text(
                        "@User${cmt["idKH"]}  •  $timeAgo",
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(cmt["text"] ?? ""),
                    );
                  },
                ),
              ),

              SafeArea(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _commentController,
                          decoration: const InputDecoration(
                            hintText: "Nhập bình luận...",
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.send, color: Colors.blue),
                        onPressed: _sendComment,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
