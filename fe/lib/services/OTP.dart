import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';
import '../screens/login_screen.dart';

Future<void> OTP_Verify(BuildContext context, String otp, String gmail) async {
  final url = Uri.parse(ApiConstants.verifyOTP);
  try {
    final response = await http.post(
      url,
      headers: ApiConstants.jsonHeaders,
      body: jsonEncode({"gmail": gmail, "otp": otp}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data["success"] == true) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(data['message'] ?? "OTP không hợp lệ")),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text("Lỗi kết nối đến server")));
  }
}
