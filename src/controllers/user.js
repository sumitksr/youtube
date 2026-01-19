import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.js';

export const registerUser = asyncHandler(async (req, res) => {
    res.status(201).json({message: 'User registered successfully'});
});
