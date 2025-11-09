import 'dart:async';
import 'package:flutter/material.dart';
import '../widgets/particles_flutter.dart';
import '../services/OTP_resetpass_service.dart';

class OTPResetPassScreen extends StatefulWidget {
  const OTPResetPassScreen({super.key});

  @override
  State<OTPResetPassScreen> createState() => _OTPResetPassScreenState();
}

class _OTPResetPassScreenState extends State<OTPResetPassScreen> {
  final TextEditingController _emailController = TextEditingController();
  final List<TextEditingController> _otpControllers = List.generate(
    6,
    (_) => TextEditingController(),
  );
  final List<FocusNode> _otpFocusNodes = List.generate(6, (_) => FocusNode());
  final TextEditingController _newPassController = TextEditingController();
  final TextEditingController _confirmPassController = TextEditingController();

  String step = "email";

  int _resendSeconds = 0;
  Timer? _timer;

  @override
  void dispose() {
    _emailController.dispose();
    _newPassController.dispose();
    _confirmPassController.dispose();
    for (var c in _otpControllers) {
      c.dispose();
    }
    for (var f in _otpFocusNodes) {
      f.dispose();
    }
    _timer?.cancel();
    super.dispose();
  }

  void _onOtpChanged(int index, String value) {
    if (value.isNotEmpty && index < 5) {
      _otpFocusNodes[index + 1].requestFocus();
    } else if (value.isEmpty && index > 0) {
      _otpFocusNodes[index - 1].requestFocus();
    }
  }

  String getOtp() => _otpControllers.map((c) => c.text).join();

  Future<void> _sendOTP() async {
    final res = await OTPResetPassService.forgotPassword(
      context,
      _emailController.text.trim(),
    );
    if (res != null && res['success'] == true) {
      setState(() => step = "otp");
      _startResendTimer();
    }
  }

  Future<void> _resendOTP() async {
    if (_resendSeconds > 0) return;
    final res = await OTPResetPassService.resendOTPResetPass(
      context,
      _emailController.text.trim(),
    );
    if (res != null && res['success'] == true) {
      _startResendTimer();
    }
  }

  void _startResendTimer() {
    setState(() {
      _resendSeconds = 15;
    });
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendSeconds == 0) {
        timer.cancel();
      } else {
        setState(() {
          _resendSeconds--;
        });
      }
    });
  }

  Future<void> _verifyOTP() async {
    final otp = getOtp();
    final res = await OTPResetPassService.verifyOTPReset(
      context,
      _emailController.text.trim(),
      otp,
    );
    if (res != null && res['success'] == true) {
      setState(() => step = "newpass");
    }
  }

  Future<void> _resetPassword() async {
    if (_newPassController.text != _confirmPassController.text) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Mật khẩu không khớp!")));
      return;
    }

    final res = await OTPResetPassService.resetPassword(
      context,
      _emailController.text.trim(),
      getOtp(),
      _newPassController.text,
      _confirmPassController.text,
    );

    if (res != null && res['success'] == true) {
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        const ParticleBackground(),
        Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(
            title: const Text("Quên mật khẩu"),
            backgroundColor: Colors.black,
          ),
          body: Padding(
            padding: const EdgeInsets.all(20),
            child: Center(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    if (step == "email") _buildEmailStep(),
                    if (step == "otp") _buildOtpStep(),
                    if (step == "newpass") _buildNewPassStep(),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEmailStep() {
    return Column(
      children: [
        const Text(
          "Nhập Gmail của bạn:",
          style: TextStyle(color: Colors.white, fontSize: 16),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _emailController,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: "Nhập Gmail...",
            hintStyle: const TextStyle(color: Colors.grey),
            filled: true,
            fillColor: Colors.grey[900],
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        const SizedBox(height: 30),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              padding: const EdgeInsets.symmetric(vertical: 15),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onPressed: _sendOTP,
            child: const Text(
              "Xác nhận gửi OTP",
              style: TextStyle(fontSize: 16, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildOtpStep() {
    return Column(
      children: [
        const Text(
          "Xác thực OTP",
          style: TextStyle(
            color: Colors.white,
            fontSize: 26,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 20),
        const Text(
          "Nhập mã OTP 6 số được gửi đến Gmail",
          style: TextStyle(color: Colors.white70),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 30),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: List.generate(6, (index) {
            return SizedBox(
              width: 40,
              child: TextField(
                controller: _otpControllers[index],
                focusNode: _otpFocusNodes[index],
                keyboardType: TextInputType.number,
                maxLength: 1,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white, fontSize: 20),
                decoration: const InputDecoration(
                  counterText: "",
                  filled: true,
                  fillColor: Colors.white24,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.all(Radius.circular(10)),
                  ),
                ),
                onChanged: (value) => _onOtpChanged(index, value),
              ),
            );
          }),
        ),
        const SizedBox(height: 30),
        ElevatedButton(
          onPressed: _verifyOTP,
          child: const Text("Xác nhận OTP"),
        ),
        const SizedBox(height: 10),
        _resendSeconds > 0
            ? Text(
                "Gửi lại OTP sau $_resendSeconds giây",
                style: const TextStyle(color: Colors.grey),
              )
            : TextButton(
                onPressed: _resendOTP,
                child: const Text(
                  "Gửi lại OTP",
                  style: TextStyle(color: Colors.white70),
                ),
              ),
      ],
    );
  }

  Widget _buildNewPassStep() {
    return Column(
      children: [
        const Text(
          "Đặt lại mật khẩu mới",
          style: TextStyle(
            color: Colors.white,
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 20),
        TextField(
          controller: _newPassController,
          obscureText: true,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: "Mật khẩu mới",
            hintStyle: const TextStyle(color: Colors.grey),
            filled: true,
            fillColor: Colors.grey[900],
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        const SizedBox(height: 20),
        TextField(
          controller: _confirmPassController,
          obscureText: true,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: "Xác nhận mật khẩu",
            hintStyle: const TextStyle(color: Colors.grey),
            filled: true,
            fillColor: Colors.grey[900],
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        const SizedBox(height: 30),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              padding: const EdgeInsets.symmetric(vertical: 15),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onPressed: _resetPassword,
            child: const Text(
              "Đặt lại mật khẩu",
              style: TextStyle(fontSize: 16, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }
}
