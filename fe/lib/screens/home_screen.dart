import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config/api_constants.dart';
import '../widgets/custom_bottom_navbar.dart';
import '../services/movie_service.dart';
import '../widgets/movie_section.dart';
import 'profile_screen.dart';
import 'search_screen.dart';
import 'getsave_screen.dart';

class HomeScreen extends StatefulWidget {
  final int userId;
  const HomeScreen({super.key, required this.userId});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  late Future<List<dynamic>> _cartoonMovies;
  late Future<List<dynamic>> _actionMovies;
  late Future<List<dynamic>> _recommendMovies;
  late Future<List<dynamic>> _watchHistory;

  @override
  void initState() {
    super.initState();
    _cartoonMovies = fetchMoviesByCategory(context, ApiConstants.cartoonMovies);
    _actionMovies = fetchMoviesByCategory(context, ApiConstants.actionMovies);
    _recommendMovies = fetchRecommend(widget.userId);
    _watchHistory = fetchWatchHistory(widget.userId);
  }

  Future<List<dynamic>> fetchWatchHistory(int userId) async {
    final response = await http.get(
      Uri.parse("${ApiConstants.watchHistory}/$userId"),
    );
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data["data"];
    } else {
      throw Exception("Failed to load watch history");
    }
  }

  Future<List<dynamic>> fetchRecommend(int userId) async {
    final response = await http.get(
      Uri.parse("${ApiConstants.recommend}/$userId"),
    );
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data["data"];
    } else {
      throw Exception("Failed to load recommendations");
    }
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      SingleChildScrollView(
        child: Column(
          children: [
            MovieSection(
              title: " Đã xem gần đây",
              moviesFuture: _watchHistory,
              isHorizontal: true,
            ),
            MovieSection(
              title: " Gợi ý cho bạn",
              moviesFuture: _recommendMovies,
              isHorizontal: true,
            ),
            MovieSection(
              title: "Phim Hoạt Hình",
              moviesFuture: _cartoonMovies,
              isHorizontal: true,
            ),
            MovieSection(
              title: "Phim Hành Động",
              moviesFuture: _actionMovies,
              isHorizontal: true,
            ),
          ],
        ),
      ),
      const SearchScreen(),
      SaveScreen(userId: widget.userId),
      ProfileScreen(userId: widget.userId),
    ];

    return Scaffold(
      backgroundColor: Colors.black,
      body: pages[_selectedIndex],
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
      ),
    );
  }
}
