const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel")
const registerUser = asyncHandler( async( req, res ) => {
    const { username, email, password } = req.body;

    if( !email || !username || !password) {
        res.status(400)
        throw new Error("Please add all the required fields")
    };

    const userExists = await User.findOne({ email });

    if( userExists) {
        res.status(400);
        throw new Error("User already exists");
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        email,
        username,
        password: hashedPassword
    });

    if( user ) {
        res.status(201);
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data")
    }
});


const loginUser = asyncHandler( async ( req, res ) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if( user && ( await bcrypt.compare(password, user.password))) {
        res.status(200);
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error( "Invalid user credentials")
    }
});

const getAllUsers = asyncHandler( async ( req, res ) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id}}).select([
            "email",
            "username",
            "avatar",
            "_id"
        ]);
        res.status(200).json(users)
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
})
const getCredentials = asyncHandler( async ( req, res ) => {
    res.status(200).json(req.user)
});

const createAvatar = asyncHandler( async ( req, res ) => {
    try {
    const data = await User.findByIdAndUpdate(req.params.id, req.body, { new: true});
    return res.status(200).json({
        image: data.avatar
    })
    } catch(err) {
        res.status(400)
        throw new Error(err.message)
    }
});

const logOut = asyncHandler( async ( req, res ) => {
    if( !req.params.id ) {
        res.status(401);
        throw new Error("Id is required")
    } else {
        onlineUsers.delete(req.params.id);
        res.status(200).json({ id: req.params.id})
    }
})
function generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "2d"
    })
};

module.exports = {
    registerUser,
    loginUser,
    getCredentials,
    getAllUsers,
    createAvatar,
    logOut
}