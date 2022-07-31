const Chat = require("../models/ChatModel");
const asyncHandler = require('express-async-handler');
const createChat = asyncHandler( async ( req, res ) => {
    const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId]
    });
    try {
        const result = await newChat.save();
        res.status(201).json(result);
    } catch(err) {
        res.status(400);
        throw new Error(err.message);
    }
});

const userChat = asyncHandler( async ( req, res ) => {
    try {
        const chat = await Chat.find({
            members: {
                $in: [req.params.userId]
            }
        });

        res.status(200).json(chat);
    } catch(err) {
        res.status(400);
        throw new Error(err.message);
    }
});

const findChat = asyncHandler( async (req, res) => {
    try {
        const chat = await Chat.findOne({
            members: {
                $all: [req.params.firstId, req.params.secondId]
            }
        });
        res.status(200).json(chat)
    } catch(err) {
        res.status(400);
        throw new Error(err.message);
    }
});

module.exports = {
    createChat,
    userChat,
    findChat
}