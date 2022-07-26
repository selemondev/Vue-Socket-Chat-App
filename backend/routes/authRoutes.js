const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { registerUser, loginUser, getCredentials, createAvatar, getAllUsers, logOut } = require("../controllers/authController");
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route("/credentials").get(protect, getCredentials)
router.route("/allUsers/:id").get(getAllUsers)
router.route("/createAvatar/:id").put(protect, createAvatar);
router.route("/users/:id").get(getAllUsers);
router.route("/logOut/:id").get(logOut)
module.exports = router;