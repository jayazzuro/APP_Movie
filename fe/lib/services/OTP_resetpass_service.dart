import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';

class OTPResetPassService {
  static void _showSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  /// Gửi OTP về Gmail
  static Future<Map<String, dynamic>> forgotPassword(
    BuildContext context,
    String gmail,
  ) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConstants.forgotPassword),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"gmail": gmail}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        _showSnackBar(context, data['message'] ?? "Gửi OTP thành công");
      } else {
        _showSnackBar(context, data['message'] ?? "Gửi OTP thất bại");
      }
      return data;
    } catch (e) {
      print("ForgotPassword error: $e");
      _showSnackBar(context, "Lỗi kết nối đến server");
      return {"success": false, "message": "Lỗi kết nối đến server"};
    }
  }

  /// Xác thực OTP
  static Future<Map<String, dynamic>> verifyOTPReset(
    BuildContext context,
    String gmail,
    String otp,
  ) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConstants.verifyOTPReset),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"gmail": gmail, "otp": otp}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        _showSnackBar(context, data['message'] ?? "Xác thực thành công");
      } else {
        _showSnackBar(context, data['message'] ?? "Xác thực thất bại");
      }
      return data;
    } catch (e) {
      print("VerifyOTPReset error: $e");
      _showSnackBar(context, "Lỗi kết nối đến server");
      return {"success": false, "message": "Lỗi kết nối đến server"};
    }
  }

  /// Đặt lại mật khẩu
  static Future<Map<String, dynamic>> resetPassword(
    BuildContext context,

    String gmail,
    String otp,
    String newPassword,
    String rePassword,
  ) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConstants.resetPassword),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "gmail": gmail,
          "otp": otp,
          "newPassword": newPassword,
          "rePassword": rePassword,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        _showSnackBar(context, data['message'] ?? "Đổi mật khẩu thành công");
      } else {
        _showSnackBar(context, data['message'] ?? "Đổi mật khẩu thất bại");
      }
      return data;
    } catch (e) {
      _showSnackBar(context, "Lỗi kết nối đến server");
      return {"success": false, "message": "Lỗi kết nối đến server"};
    }
  }

  /// Gửi lại OTP
  static Future<Map<String, dynamic>> resendOTPResetPass(
    BuildContext context,
    String gmail,
  ) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConstants.resendOTPResetpass),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"gmail": gmail}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        _showSnackBar(context, data['message'] ?? "Gửi lại OTP thành công");
      } else {
        _showSnackBar(context, data['message'] ?? "Gửi lại OTP thất bại");
      }
      return data;
    } catch (e) {
      print("ResendOTPResetPass error: $e");
      _showSnackBar(context, "Lỗi kết nối đến server");
      return {"success": false, "message": "Lỗi kết nối đến server"};
    }
  }
}
