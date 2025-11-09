const express = require("express");
const router = express.Router();
const AuthControllerAdmin = require("../controller/admin/AuthController");
const MovieManagement = require("../controller/admin/MovieManagement");

// Get
router.get("/movies", MovieManagement.getMovie);
router.get("/movies/:idmv", MovieManagement.getMovieById);

// Post
router.post("/login", AuthControllerAdmin.Login);
router.post("/addMovie", MovieManagement.addMovie);

// Delete
router.delete("/deleteMovie/:idmv", MovieManagement.deleteMovie);

// Put
router.put("/updateMovie/:idmv", MovieManagement.PutUpLoadMovie);

module.exports = router;
