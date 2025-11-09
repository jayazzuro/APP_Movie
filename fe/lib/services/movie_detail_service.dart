import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';

class MovieDetailService {
  static Future<bool> saveMovie({
    required String userId,
    required Map<String, dynamic> movie,
  }) async {
    final url = Uri.parse('${ApiConstants.baseUrl}/api/save-movie');

    try {
      final response = await http.post(
        url,
        headers: ApiConstants.jsonHeaders,
        body: jsonEncode({
          'idKH': int.tryParse(userId),
          'idmv': movie['idmv'],
          'TenPhim': movie['TenPhim'] ?? '',
          'HinhAnh': movie['HinhAnh'] ?? '',
          'MoTa': movie['MoTa'] ?? movie['mota'] ?? '',
        }),
      );

      if (response.statusCode == 201) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
