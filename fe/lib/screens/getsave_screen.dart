import 'package:flutter/material.dart';
import '../config/api_constants.dart';
import '../services/getsave_service.dart';

class SaveScreen extends StatefulWidget {
  final int userId;

  const SaveScreen({super.key, required this.userId});

  @override
  State<SaveScreen> createState() => _SaveScreenState();
}

class _SaveScreenState extends State<SaveScreen> {
  late Future<List<dynamic>> _savedMoviesFuture;

  @override
  void initState() {
    super.initState();
    _savedMoviesFuture = SavedMovieService.fetchSavedMovies(widget.userId);
  }

  Future<void> _deleteMovie(int idsaves) async {
    final success = await SavedMovieService.deleteSavedMovie(idsaves);
    if (success) {
      setState(() {
        _savedMoviesFuture = SavedMovieService.fetchSavedMovies(widget.userId);
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Xóa phim thành công")));
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Xóa thất bại")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Phim đã lưu'),
        backgroundColor: Colors.black,
      ),
      backgroundColor: Colors.black,
      body: FutureBuilder<List<dynamic>>(
        future: _savedMoviesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
              child: Text(
                'Lỗi: ${snapshot.error}',
                style: const TextStyle(color: Colors.white),
              ),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text(
                'Bạn chưa lưu phim nào',
                style: TextStyle(color: Colors.white),
              ),
            );
          }

          final savedMovies = snapshot.data!;

          return ListView.builder(
            itemCount: savedMovies.length,
            itemBuilder: (context, index) {
              final movie = savedMovies[index];
              final imageUrl =
                  movie['HinhAnh'] != null && movie['HinhAnh'] != ''
                  ? '${ApiConstants.productUploadApi}/${movie['HinhAnh']}'
                  : null;

              return Card(
                color: Colors.grey[900],
                margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                child: ListTile(
                  leading: imageUrl != null
                      ? Image.network(imageUrl, width: 60, fit: BoxFit.cover)
                      : Container(
                          width: 60,
                          color: Colors.grey,
                          child: const Icon(Icons.movie, color: Colors.white),
                        ),
                  title: Text(
                    movie['TenPhim'] ?? 'Không có tên phim',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  subtitle: Text(
                    'Ngày lưu: ${movie['Ngayluu'] != null ? DateTime.parse(movie['Ngayluu']).toLocal().toString().split(' ')[0] : 'Không rõ'}',
                    style: const TextStyle(color: Colors.white70),
                  ),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red),
                    onPressed: () async {
                      final saveId = movie['idsaves'];
                      if (saveId != null) {
                        final confirm = await showDialog<bool>(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text("Xác nhận"),
                            content: const Text(
                              "Bạn có chắc muốn xóa phim này không?",
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context, false),
                                child: const Text("Hủy"),
                              ),
                              TextButton(
                                onPressed: () => Navigator.pop(context, true),
                                child: const Text(
                                  "Xóa",
                                  style: TextStyle(color: Colors.red),
                                ),
                              ),
                            ],
                          ),
                        );

                        if (confirm == true) {
                          _deleteMovie(saveId);
                        }
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("Không tìm thấy ID bản ghi để xóa"),
                          ),
                        );
                      }
                    },
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
