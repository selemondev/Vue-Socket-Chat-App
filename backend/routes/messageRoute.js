const express = require("express");
const router = express.Router();
const { addMessage, getMessages } = require("../controllers/messageController");
router.route("/addMessage").post(addMessage);
router.route("/getMessages").post(getMessages)
module.exports = router;