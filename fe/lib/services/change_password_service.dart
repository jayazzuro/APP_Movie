import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';

class ChangePasswordService {
  static Future<Map<String, dynamic>> changePassword({
    required int userId,
    required String oldPassword,
    required String newPassword,
    required String confirmPassword,
  }) async {
    final uri = Uri.parse(ApiConstants.changePassword);

    final Map<String, dynamic> data = {
      "userId": userId,
      "oldPassword": oldPassword,
      "newPassword": newPassword,
      "confirmPassword": confirmPassword,
    };

    try {
      final response = await http.post(
        uri,
        headers: ApiConstants.jsonHeaders,
        body: jsonEncode(data),
      );

      final Map<String, dynamic> responseBody = jsonDecode(response.body);

      switch (response.statusCode) {
        case 200:
        case 400:
          return responseBody;
        default:
          return {
            "success": false,
            "message": "Lỗi server (${response.statusCode})",
          };
      }
    } catch (error) {
      return {"success": false, "message": "Đã xảy ra lỗi: $error"};
    }
  }
}
