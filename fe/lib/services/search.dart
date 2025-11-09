import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';

Future<List<dynamic>> searchMovies(BuildContext context, String keyword) async {
  final url = "${ApiConstants.baseUrl}/api/search?keyword=$keyword";
  final response = await http.get(Uri.parse(url));

  if (response.statusCode == 200) {
    final jsonData = json.decode(response.body);
    if (jsonData['success'] == true) {
      return jsonData['data'];
    } else {
      return [];
    }
  } else {
    throw Exception("Failed to search movies");
  }
}
