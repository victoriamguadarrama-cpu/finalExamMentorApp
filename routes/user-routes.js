const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");

//SIGNUP
router.get("/signup", userController.getSignup);
router.post("/signup", userController.postSignup);

//LOGIN
router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);

//LOGOUT
router.get("/logout", userController.postLogout);
router.post("/logout", userController.postLogout);

router.get("/profile", userController.getProfile);

module.exports = router;