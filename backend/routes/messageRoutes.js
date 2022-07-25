const express = require("express");
const router = express.Router();
const { getMessages, addMessage } = require("../controllers/messageController");
router.route("/get").get(getMessages);
router.route("/create").post(addMessage)
module.exports = router;