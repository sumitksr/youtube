const {asyncHandler} = require('../utils/asyncHandler.js');
const User = require('../models/User.js');

const registerUser = asyncHandler(async (req, res) => {
    res.status(201).json({message: 'User registered successfully'});
});
