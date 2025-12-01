import 'package:flutter/material.dart';
import '../config/api_constants.dart';
import '../utils/shared_pref.dart';
import '../screens/video_screen.dart';
import '../services/video_service.dart';
import '../services/movie_detail_service.dart';
import '../services/movie_service.dart';
import 'getsave_screen.dart';

class MovieDetailScreen extends StatefulWidget {
  final Map<String, dynamic> movie;

  const MovieDetailScreen({super.key, required this.movie});

  @override
  State<MovieDetailScreen> createState() => _MovieDetailScreenState();
}

class _MovieDetailScreenState extends State<MovieDetailScreen> {
  int _selectedRating = 0;
  String? _userId;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _loadUserId();
  }

  Future<void> _loadUserId() async {
    final id = await SharedPref.getUserId();
    if (id != null) {
      final rating = await getUserRating(int.parse(id), widget.movie["idmv"]);
      setState(() {
        _userId = id;
        _selectedRating = rating ?? 0;
      });
    }
  }

  // --- Lưu rating khi chọn sao ---
  void _setRating(int rating) async {
    if (_userId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Bạn cần đăng nhập")));
      return;
    }

    setState(() {
      _selectedRating = rating;
    });

    // Gọi API để lưu rating vào watch_history
    bool ok = await saveWatchHistory(
      int.parse(_userId!),
      widget.movie["idmv"],
      rating: rating,
    );

    if (ok) {
      print(" Đã lưu rating $rating sao vào watch_history");
    } else {
      print(" Lỗi khi lưu rating");
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Lỗi khi lưu rating")));
    }
  }

  Future<void> _saveMovie() async {
    if (_userId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Bạn cần đăng nhập để lưu phim')),
      );
      return;
    }

    setState(() {
      _isSaving = true;
    });

    final success = await MovieDetailService.saveMovie(
      userId: _userId!,
      movie: widget.movie,
    );

    setState(() {
      _isSaving = false;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(success ? 'Lưu phim thành công' : 'Bạn đã lưu phim này'),
        backgroundColor: success ? Colors.green : Colors.red,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final movie = widget.movie;
    final imagePath = movie['HinhAnh'];
    final imageUrl = imagePath != null
        ? '${ApiConstants.productUploadApi}/$imagePath'
        : '';

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(movie['TenPhim'] ?? "Chi tiết phim"),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                imageUrl,
                height: 220,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 16),

            Text(
              movie['TenPhim'] ?? '',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),

            // --- Rating ---
            Row(
              children: List.generate(5, (index) {
                final starIndex = index + 1;
                return IconButton(
                  icon: Icon(
                    Icons.star,
                    color: starIndex <= _selectedRating
                        ? Colors.amber
                        : Colors.grey,
                  ),
                  onPressed: () => _setRating(starIndex), // 👈 lưu rating
                );
              }),
            ),

            const SizedBox(height: 16),
            Text(
              movie['MoTa'] ?? 'Không có mô tả',
              style: const TextStyle(color: Colors.white70, fontSize: 16),
            ),
            const SizedBox(height: 24),

            // --- Hai nút nằm cạnh nhau ---
            Row(
              children: [
                // Nút Xem phim (tích hợp lưu lịch sử)
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    icon: const Icon(Icons.play_arrow, color: Colors.white),
                    label: const Text(
                      "Xem phim",
                      style: TextStyle(color: Colors.white, fontSize: 16),
                    ),
                    onPressed: () async {
                      if (_userId == null) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text("Bạn cần đăng nhập")),
                        );
                        return;
                      }

                      bool hasSub = await checkUserSubscription(_userId!);
                      if (!hasSub) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              "Bạn chưa đăng ký gói. Vui lòng đăng ký để xem phim.",
                            ),
                            backgroundColor: Colors.orange,
                          ),
                        );
                        return;
                      }

                      bool ok = await saveWatchHistory(
                        int.parse(_userId!),
                        widget.movie["idmv"],
                      );

                      if (!ok) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text("Lỗi khi lưu lịch sử")),
                        );
                        return;
                      }

                      final videoUrl = await fetchMovieVideo(
                        widget.movie['idmv'],
                      );
                      if (videoUrl != null && mounted) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => YoutubeWithCommentsScreen(
                              youtubeUrl: videoUrl,
                              idmv: widget.movie['idmv'],
                            ),
                          ),
                        );
                      }
                    },
                  ),
                ),

                const SizedBox(width: 12),

                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blueGrey,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    icon: _isSaving
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Icon(
                            Icons.bookmark_border,
                            color: Colors.white,
                          ),
                    label: Text(
                      _isSaving ? "Đang lưu..." : "Lưu phim",
                      style: const TextStyle(color: Colors.white, fontSize: 16),
                    ),
                    onPressed: _isSaving ? null : _saveMovie,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
