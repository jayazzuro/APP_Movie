import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';
import 'package:url_launcher/url_launcher.dart';
import '../screens/OTP_screen.dart';

Future<void> register(
  BuildContext context,
  String Fullname,
  String Email,
  String PassWord,
  String RePassWord,
  String Phone,
) async {
  final url = Uri.parse(ApiConstants.registerUser);
  try {
    final res = await http.post(
      url,
      headers: ApiConstants.jsonHeaders,
      body: jsonEncode({
        "name": Fullname,
        "gmail": Email,
        "passWord": PassWord,
        "RepassWord": RePassWord,
        "phone": Phone,
      }),
    );
    final data = jsonDecode(res.body);
    if (res.statusCode == 200 && data['success'] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Đăng ký thành công , kiểm tra email xác thực'),
        ),
      );

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => OtpVerificationScreen(gmail: Email)),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(data["message"] ?? 'Đăng kí thất bại')),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text("Lỗi kết nối đến server")));
  }
}
