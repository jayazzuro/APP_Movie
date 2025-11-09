import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';
import '../screens/login_screen.dart';

Future<void> rendOTP(BuildContext context, String gmail) async {
  final url = Uri.parse(ApiConstants.rendOTP);
  try {
    final response = await http.post(
      url,
      headers: ApiConstants.jsonHeaders,
      body: jsonEncode({"gmail": gmail}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success'] == true) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Đã gửi lại mã OTP")));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(data['message'] ?? "Gửi lại OTP thất bại")),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text("Gửi lại OTP thất")));
  }
  ;
}
