import 'package:flutter/material.dart';
import 'dart:async';

class AnimatedGradientBackground extends StatefulWidget {
  const AnimatedGradientBackground({super.key});

  @override
  State<AnimatedGradientBackground> createState() =>
      _AnimatedGradientBackgroundState();
}

class _AnimatedGradientBackgroundState
    extends State<AnimatedGradientBackground> {
  final List<List<Color>> _gradientColors = [
    [Colors.deepPurple, Colors.pink],
    [Colors.blue, Colors.purpleAccent],
    [Colors.teal, Colors.indigo],
    [Colors.orange, Colors.redAccent],
  ];

  int _index = 0;

  @override
  void initState() {
    super.initState();
    Timer.periodic(const Duration(seconds: 5), (timer) {
      setState(() {
        _index = (_index + 1) % _gradientColors.length;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(seconds: 5),
      curve: Curves.easeInOut,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: _gradientColors[_index],
        ),
      ),
      width: double.infinity,
      height: double.infinity,
    );
  }
}
