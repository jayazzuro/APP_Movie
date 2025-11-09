const express = require("express");
const router = express.Router();
const homeController = require("../controller/user/homeController");
const auth = require("../controller/user/AuthController");
const otp = require("../controller/user/otpController");
const passWord = require("../controller/user/passWordController");
const movie = require("../controller/user/movieController");
const cmt = require("../controller/user/commentController");
const save = require("../controller/user/saveController");
const watch = require("../controller/user/watchController");
const user = require("../controller/user/userController");
const upload = require("../middlewares/upload");

// GET
router.get("/api", homeController.getApi);
router.get("/api/movie_car", movie.Item_Movie_Cartoon);
router.get("/api/movie_act", movie.Item_Movie_Action);
router.get("/uploads", upload.single("images"), movie.productUploadApi);
router.get("/api/search", movie.search);
router.get("/api/movie_video/:id", movie.movie_video);
router.get("/api/recommend/:idKH", movie.recommendMovies);

router.get("/api/getUserById/:id", user.getUserById);

router.get("/api/saved-movies/:idKH", save.getSavedMovies);
router.get("/api/comments/:idmv", cmt.comment);

router.get("/api/watch-history/:idKH", watch.getWatchHistory);
router.get("/api/watch-history/:idKH/:idmv", watch.getUserRating);

router.get("/api/packages", homeController.getAllPackages);

router.get("/api/check-subscription/:idkh", homeController.checkSubscription);

// POST OTP
router.post("/api/verifyOTPReset", otp.verifyOTPReset);
router.post("/resend-otp-reset-pass", otp.resendOTPResetpass);
router.post("/api/verify-OTP", otp.verifyOTP);
router.post("/api/rendOTP", otp.rendOTP);
// POST AUTH
router.post("/api/login", auth.postLoginApi);
router.post("/api/registerUser", auth.postRegisterApi);
// POST PASSWORD
router.post("/api/forgotPassword", passWord.forgotPassword);
router.post("/api/resetPassword", passWord.resetPassword);
router.post("/api/changePass", passWord.changePassword);

router.post("/api/postComment", cmt.addCmt);
router.post("/api/save-movie", save.saveMovie);

router.post("/api/watch-history", watch.addWatchHistory);

//thanh toán
router.post("/api/momo/callback", homeController.momoCallback);
router.post("/api/handle-subscription", homeController.handleSubscription);

// DELETE
router.delete("/api/saved-movies/:idsaves", save.deleteSavedMovie);

module.exports = router;
