import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/subscription_service.dart';

class SubscriptionPage extends StatefulWidget {
  final String idkh;

  const SubscriptionPage({Key? key, required this.idkh}) : super(key: key);

  @override
  _SubscriptionPageState createState() => _SubscriptionPageState();
}

class _SubscriptionPageState extends State<SubscriptionPage> {
  final SubscriptionService _service = SubscriptionService();
  late Future<List<dynamic>> _packages;

  final List<Color> colors = [Colors.black, Colors.red.shade900, Colors.black];
  int colorIndex = 0;
  late Timer timer;

  @override
  void initState() {
    super.initState();
    _packages = _service.fetchPackages();

    timer = Timer.periodic(const Duration(seconds: 4), (Timer t) {
      setState(() {
        colorIndex = (colorIndex + 1) % colors.length;
      });
    });
  }

  @override
  void dispose() {
    timer.cancel();
    super.dispose();
  }

  /// Hiển thị card gói dịch vụ
  Widget buildPlanCard(Map<String, dynamic> p, NumberFormat formatter) {
    double? gia = double.tryParse(p["gia"].toString());
    final priceText = (gia != null && gia > 0)
        ? "${formatter.format(gia)} ${p["dvt"]}"
        : "Miễn phí";

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        elevation: 8,
        color: Colors.black87,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Text(
                p["namepk"],
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.redAccent,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                priceText,
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                p["mo_ta"] ?? "",
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 12, color: Colors.white70),
              ),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => _service.handleSubscriptionSelection(
                    context,
                    widget.idkh,
                    p["idpk"].toString(),
                    p["namepk"],
                    gia?.toString(),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE50914),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    "Chọn gói",
                    style: TextStyle(fontSize: 15, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Giao diện chính
  @override
  Widget build(BuildContext context) {
    final formatter = NumberFormat("#,##0", "vi_VN");

    return AnimatedContainer(
      duration: const Duration(seconds: 2),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            colors[colorIndex],
            colors[(colorIndex + 1) % colors.length],
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          title: const Text(
            "Chọn gói đăng ký",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
        ),
        body: FutureBuilder<List<dynamic>>(
          future: _packages,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: CircularProgressIndicator(color: Colors.white),
              );
            }
            if (snapshot.hasError) {
              return Center(
                child: Text(
                  "Lỗi: ${snapshot.error}",
                  style: const TextStyle(color: Colors.red),
                ),
              );
            }
            if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(
                child: Text(
                  "Không có gói đăng ký nào",
                  style: TextStyle(color: Colors.white),
                ),
              );
            }

            final packages = snapshot.data!;
            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Column(
                children: packages
                    .map((p) => buildPlanCard(p, formatter))
                    .toList(),
              ),
            );
          },
        ),
      ),
    );
  }
}
