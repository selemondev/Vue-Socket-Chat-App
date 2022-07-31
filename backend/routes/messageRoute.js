const express = require("express");
const router = express.Router();
const { addMessage, getMessages } = require("../controllers/MessageController");
router.route("/addMessage").post(addMessage);
router.route("/getMessages/:chatId").get(getMessages)
module.exports = router;