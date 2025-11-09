import 'package:flutter/material.dart';
import '../widgets/AnimatedGradientBackground.dart';
import '../services/registerUser.dart';

class RegisterScreen extends StatelessWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final nameController = TextEditingController();
    final emailController = TextEditingController();
    final passwordController = TextEditingController();
    final rePassController = TextEditingController();
    final phoneController = TextEditingController();

    return Stack(
      children: [
        const AnimatedGradientBackground(),
        Scaffold(
          backgroundColor: Colors.transparent,
          body: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Create Your Account',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 30),

                  buildInputField(nameController, "Full Name", Icons.person),
                  const SizedBox(height: 15),
                  buildInputField(emailController, "Email", Icons.email),
                  const SizedBox(height: 15),
                  buildInputField(
                    passwordController,
                    "Password",
                    Icons.lock,
                    isPassword: true,
                  ),
                  const SizedBox(height: 15),
                  buildInputField(
                    rePassController,
                    "Re-enter Password",
                    Icons.lock_outline,
                    isPassword: true,
                  ),
                  const SizedBox(height: 15),
                  buildInputField(phoneController, "Phone Number", Icons.phone),
                  const SizedBox(height: 25),

                  ElevatedButton(
                    onPressed: () {
                      register(
                        context,
                        nameController.text,
                        emailController.text,
                        passwordController.text,
                        rePassController.text,
                        phoneController.text,
                      );
                    },
                    child: const Text("Register"),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: const Text(
                      "Already have an account? Login here",
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget buildInputField(
    TextEditingController controller,
    String label,
    IconData icon, {
    bool isPassword = false,
  }) {
    return TextField(
      controller: controller,
      obscureText: isPassword,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: Colors.white70),
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white70),
        filled: true,
        fillColor: Colors.white24,
        border: const OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(10)),
        ),
      ),
    );
  }
}
