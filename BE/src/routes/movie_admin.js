const express = require("express");
const router = express.Router();
const AuthControllerAdmin = require("../controller/admin/AuthController");
const MovieManagement = require("../controller/admin/MovieManagement");
const UserManagement = require("../controller/admin/UserMangement");
const PacManagement = require("../controller/admin/PacManagement");

// Get
router.get("/movies", MovieManagement.getMovie);
router.get("/movies/:idmv", MovieManagement.getMovieById);
router.get("/users", UserManagement.getUser);
router.get("/users/:idKH", UserManagement.getUserById);
router.get("/pack", PacManagement.getPackage);
router.get("/pack/:idpk", PacManagement.getPackageById);

// Post
router.post("/login", AuthControllerAdmin.Login);
router.post("/addMovie", MovieManagement.addMovie);
router.post("/addPack", PacManagement.addPack);

// Delete
router.delete("/deleteMovie/:idmv", MovieManagement.deleteMovie);
router.delete("/deletePack/:idpk", PacManagement.deletePack);

// Put
router.put("/updateMovie/:idmv", MovieManagement.PutUpLoadMovie);
router.put("/updatePackage/:idpk", PacManagement.updatePackage);

module.exports = router;
