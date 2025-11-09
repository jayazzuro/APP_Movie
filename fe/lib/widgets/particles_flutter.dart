import 'package:flutter/material.dart';
import 'package:particles_flutter/particles_flutter.dart';

class ParticleBackground extends StatelessWidget {
  const ParticleBackground({super.key});

  @override
  Widget build(BuildContext context) {
    return CircularParticle(
      awayRadius: 80,
      numberOfParticles: 150,
      speedOfParticles: 1.5,
      height: MediaQuery.of(context).size.height,
      width: MediaQuery.of(context).size.width,
      onTapAnimation: true,
      particleColor: Colors.white.withAlpha(150),
      awayAnimationDuration: const Duration(milliseconds: 600),
      maxParticleSize: 6,
      isRandSize: true,
      isRandomColor: true,
      randColorList: [Colors.white, Colors.purpleAccent, Colors.blue],
      connectDots: false,
    );
  }
}
