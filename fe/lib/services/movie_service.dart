import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';

Future<List<dynamic>> fetchMoviesByCategory(
  BuildContext context,
  String apiUrl,
) async {
  try {
    final response = await http.get(Uri.parse(apiUrl));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        return data['data'];
      }
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Dữ liệu trả về không hợp lệ')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi server: ${response.statusCode}')),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text("Lỗi kết nối đến server")));
  }
  return [];
}

//thêm
Future<bool> saveWatchHistory(
  int userId,
  int movieId, {
  double progress = 1.0,
  int? rating,
}) async {
  final response = await http.post(
    Uri.parse(ApiConstants.watchHistory),
    headers: ApiConstants.jsonHeaders,
    body: json.encode({
      "idKH": userId,
      "idmv": movieId,
      "progress": progress,
      "rating": rating,
    }),
  );

  return response.statusCode == 200;
}

//thêm
Future<int?> getUserRating(int userId, int movieId) async {
  final response = await http.get(
    Uri.parse("${ApiConstants.watchHistory}/$userId/$movieId"),
  );

  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    if (data["success"] == true) {
      return data["rating"];
    }
  }
  return null;
}

// Kiểm tra người dùng có gói đăng ký hoạt động hay chưa
Future<bool> checkUserSubscription(String userId) async {
  final url = Uri.parse(ApiConstants.checkSubscription(userId));

  try {
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success'] == true && data['active'] == true) {
        return true;
      }
    }
  } catch (e) {
    print("Lỗi kiểm tra gói đăng ký: $e");
  }

  return false;
}
