import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../config/api_constants.dart';

class SubscriptionService {
  ///  Lấy danh sách gói
  Future<List<dynamic>> fetchPackages() async {
    final uri = Uri.parse(ApiConstants.getPackages);
    final res = await http.get(uri, headers: ApiConstants.jsonHeaders);

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      return List<Map<String, dynamic>>.from(data['data']);
    } else {
      throw Exception("Không tải được danh sách gói");
    }
  }

  ///  Xử lý chọn gói
  Future<void> handleSubscriptionSelection(
    BuildContext context,
    String idkh,
    String idpk,
    String title,
    String? priceText,
  ) async {
    try {
      final priceValue =
          double.tryParse(
            priceText?.replaceAll(RegExp(r'[^0-9]'), '') ?? '0',
          ) ??
          0;

      final uri = Uri.parse(ApiConstants.handleSubscription);
      final response = await http.post(
        uri,
        headers: ApiConstants.jsonHeaders,
        body: jsonEncode({
          "idkh": idkh,
          "idpk": idpk,
          "amount": priceValue,
          "orderInfo": "Thanh toán gói $title",
        }),
      );

      final data = jsonDecode(response.body);

      //  Nếu có gói đang hoạt động => hiển thị thông báo
      if (response.statusCode == 400 || data['success'] == false) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['message'] ?? " Lỗi xử lý")),
        );
        return;
      }

      //  Nếu có payUrl => mở MoMo
      if (data['payUrl'] != null) {
        await launchUrl(
          Uri.parse(data['payUrl']),
          mode: LaunchMode.externalApplication,
        );
      } else {
        //  Gói miễn phí hoặc đăng ký xong
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['message'] ?? "Thành công!")),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(" Lỗi: $e")));
    }
  }
}
