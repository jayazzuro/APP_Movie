import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';

class SavedMovieService {
  /// Lấy danh sách phim đã lưu theo userId
  static Future<List<dynamic>> fetchSavedMovies(int userId) async {
    final url = Uri.parse(ApiConstants.savedMovies(userId));
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      return data['data'] ?? [];
    } else {
      throw Exception('Failed to load saved movies');
    }
  }

  /// Xóa phim theo idsaves trong bảng saves
  static Future<bool> deleteSavedMovie(int idsaves) async {
    final url = Uri.parse(ApiConstants.deleteSavedMovie(idsaves));
    final response = await http.delete(url);

    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }
}
