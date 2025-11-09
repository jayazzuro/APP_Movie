import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';

class ProfileService {
  Future<Map<String, dynamic>?> getUserById(int userId) async {
    try {
      final url = Uri.parse(ApiConstants.getUserById(userId));
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data["success"] == true) {
          return data["user"];
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
