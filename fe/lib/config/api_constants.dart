class ApiConstants {
  static const String baseUrl =
      'https://simply-clerk-basketball-organization.trycloudflare.com';

  static const String login = '$baseUrl/api/login';
  static const String registerUser = '$baseUrl/api/registerUser';
  static const String verifyOTP = '$baseUrl/api/verify-OTP';
  static const String rendOTP = '$baseUrl/api/rendOTP';
  static const String cartoonMovies = '$baseUrl/api/movie_car';
  static const String actionMovies = '$baseUrl/api/movie_act';
  static const String productUploadApi = '$baseUrl/img';
  static const String video = '$baseUrl/api/movie_video/';
  static String getUserById(int id) => '$baseUrl/api/getUserById/$id';
  static const String changePassword = '$baseUrl/api/changePass';
  static const String search = '$baseUrl/api/search';
  static String savedMovies(int userId) => '$baseUrl/api/saved-movies/$userId';
  static String getSavedMovies(String userId) =>
      '$baseUrl/api/saved-movies/$userId';
  static String deleteSavedMovie(int idsaves) =>
      '$baseUrl/api/saved-movies/$idsaves';
  static const String socket = baseUrl;
  static const String forgotPassword = "$baseUrl/api/forgotPassword";
  static const String verifyOTPReset = "$baseUrl/api/verifyOTPReset";
  static const String resetPassword = "$baseUrl/api/resetPassword";
  static const resendOTPResetpass = "$baseUrl/resend-otp-reset-pass";

  static const String recommend = "$baseUrl/api/recommend";
  static const String watchHistory = "$baseUrl/api/watch-history";

  static const String getPackages = "$baseUrl/api/packages";
  static String checkSubscription(String userId) =>
      '$baseUrl/api/check-subscription/$userId';

  //thanh toán
  static const String handleSubscription = "$baseUrl/api/handle-subscription";

  static const Map<String, String> jsonHeaders = {
    'Content-Type': 'application/json',
  };
}
