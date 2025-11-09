import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';

Future<String?> fetchMovieVideo(int id) async {
  final Url = Uri.parse("${ApiConstants.video}$id");
  try {
    final response = await http.get(Url, headers: ApiConstants.jsonHeaders);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        print(data['data']['Video']);
        return data['data']['Video'];
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}
