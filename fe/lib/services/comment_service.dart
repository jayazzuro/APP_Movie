import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';

class CommentService {
  // Lấy danh sách comment theo idmv
  static Future<List<dynamic>> getComments(int idmv) async {
    final url = Uri.parse("${ApiConstants.baseUrl}/api/comments/$idmv");

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      if (json["success"] == true) {
        return json["data"];
      }
      return [];
    } else {
      throw Exception("Failed to load comments");
    }
  }

  // Thêm comment mới
  static Future<void> postComment(String text, int idKH, int idmv) async {
    final url = Uri.parse("${ApiConstants.baseUrl}/api/postComment");

    final response = await http.post(
      url,
      headers: ApiConstants.jsonHeaders,
      body: jsonEncode({"text": text, "idKH": idKH, "idmv": idmv}),
    );

    if (response.statusCode != 200) {
      throw Exception("Failed to post comment: ${response.body}");
    }
  }
}
