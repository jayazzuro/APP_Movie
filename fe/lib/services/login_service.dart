import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';
import '../utils/shared_pref.dart';
import '../screens/home_screen.dart';

Future<void> loginUser(
  BuildContext context,
  String email,
  String password,
) async {
  final url = Uri.parse(ApiConstants.login);
  try {
    final response = await http.post(
      url,
      headers: ApiConstants.jsonHeaders,
      body: jsonEncode({'gmail': email, 'password': password}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success'] == true) {
      final userId = data['user']['idKH'];
      await SharedPref.saveUserId(userId.toString());

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Đăng nhập thành công')));

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => HomeScreen(userId: userId)),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(data['message'] ?? 'Đăng nhập thất bại')),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Lỗi kết nối đến server')));
  }
}
