const Message = require("../models/messageModel");
const asyncHandler = require("express-async-handler");
const getMessages = asyncHandler( async (req, res ) => {
    try {
    const { from, to } = req.body;
    const messages = await Message.find({
        users: {
            $all: [from, to]
        }
    }).sort({ updatedAt: 1});

    const projectedMessages = messages.map((msg) => {
        return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text
        }
    });
    res.status(200).json(projectedMessages)
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
});

const addMessage = asyncHandler( async ( req, res ) => {
    try {
        const { from, to, message } = req.body;
        const data = await Message.create({
            message: { text: message },
            users: [ from, to],
            sender: from
        });

        if ( data ) {
            res.status(201).json(data)
        }
    } catch(error) {
        res.status(400);
        throw new Error(error.message)
    }
});

module.exports = {
    getMessages,
    addMessage
}