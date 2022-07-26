const Message = require("../models/MessageModel")
const asyncHandler = require("express-async-handler");
const getMessages = asyncHandler( async ( req, res ) => {
    try {
        const { from, to } = req.body;
    
        const messages = await Message.find({
          users: {
            $all: [from, to],
          },
        }).sort({ updatedAt: 1 });
    
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
          };
        });
        res.json(projectedMessages);
      } catch (error) {
        res.status(400);
        throw new Error(error.message)
      }
});

const addMessage = asyncHandler( async ( req, res ) => {
    try {
        const { from, to, message } = req.body;
        const data = await Message.create({
          message: { text: message },
          users: [from, to],
          sender: from,
        });
    
        if (data) return res.json(data.message.text);
        else return res.json({ msg: "Failed to add message to the database" });
      } catch (error) {
        res.status(400);
        throw new Error(error.message)
      }
})

module.exports = {
    getMessages,
    addMessage
}