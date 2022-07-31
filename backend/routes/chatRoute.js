const express = require('express');
const router = express.Router();
const { createChat, findChat, userChat } = require("../controllers/ChatController");
router.route("/createChat").post(createChat);
router.route("/:userId").get(userChat);
router.route("/find/:firstId/:secondId").get(findChat);

module.exports = router;