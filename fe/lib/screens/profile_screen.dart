import 'package:flutter/material.dart';
import '../services/profile_service.dart';
import '../utils/shared_pref.dart';
import 'login_screen.dart';
import 'change_password_screen.dart';
import 'subscription_screen.dart';

class ProfileScreen extends StatefulWidget {
  final int userId;
  const ProfileScreen({super.key, required this.userId});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? userData;
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final data = await ProfileService().getUserById(widget.userId);
    setState(() {
      if (data != null) {
        userData = data;
      } else {
        errorMessage = "Không tìm thấy thông tin người dùng";
      }
      isLoading = false;
    });
  }

  Future<void> _logout() async {
    await SharedPref.clearUser();
    if (!mounted) return;
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.white))
          : errorMessage != null
          ? Center(
              child: Text(
                errorMessage!,
                style: const TextStyle(color: Colors.red, fontSize: 16),
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const SizedBox(height: 40),
                  CircleAvatar(
                    radius: 50,
                    backgroundColor: Colors.white24,
                    child: const Icon(
                      Icons.person,
                      size: 60,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    userData?['name'] ?? "Tên người dùng",
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 30),

                  // Email
                  buildInfoTile(Icons.email, "Email", userData?['gmail'] ?? ""),
                  const SizedBox(height: 10),

                  // Số điện thoại
                  buildInfoTile(
                    Icons.phone,
                    "Số điện thoại",
                    userData?['phone'] ?? "",
                  ),
                  const SizedBox(height: 30),

                  // --- Chức năng ---
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Chức năng thành viên",
                        style: TextStyle(
                          color: Colors.blue.shade300,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),

                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF1C1C1C),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        // Đăng ký gói
                        ListTile(
                          leading: const Icon(
                            Icons.subscriptions,
                            color: Colors.white,
                          ),
                          title: const Text(
                            "Đăng ký gói",
                            style: TextStyle(color: Colors.white),
                          ),
                          onTap: () {
                            final idkh =
                                userData?['idkh']?.toString() ??
                                widget.userId.toString();

                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => SubscriptionPage(idkh: idkh),
                              ),
                            );
                          },
                        ),
                        const Divider(color: Colors.white24, height: 1),

                        // Đổi mật khẩu
                        ListTile(
                          leading: const Icon(Icons.lock, color: Colors.white),
                          title: const Text(
                            "Đổi mật khẩu",
                            style: TextStyle(color: Colors.white),
                          ),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) =>
                                    ChangePasswordScreen(userId: widget.userId),
                              ),
                            );
                          },
                        ),
                        const Divider(color: Colors.white24, height: 1),

                        // Đăng xuất
                        ListTile(
                          leading: const Icon(Icons.logout, color: Colors.red),
                          title: const Text(
                            "Đăng xuất",
                            style: TextStyle(color: Colors.red),
                          ),
                          onTap: _logout,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget buildInfoTile(IconData icon, String title, String value) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF2C2C2C),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.white),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                value.isNotEmpty ? value : "Chưa cập nhật",
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
