import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
require('dotenv').config();
import {ApiError} from '../utils/ApiError.js';
import { uploadOnCloudinary} from '../config/cloudinary.js';

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password ,fullName  } = req.body;
     if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    const avatarLocalPath = req.files?.profilePicture[0]?.path;
    const coverPhotoLocalPath = req.files?.coverPhoto[0]?.path;

    if(!avatarLocalPath ){
        throw new ApiError(400, "Profile picture is required");
    }

    const avatarUploadResponse = await uploadOnCloudinary(avatarLocalPath);
    const coverPhotoUploadResponse = await uploadOnCloudinary(coverPhotoLocalPath);

    if (!avatarUploadResponse ) {
        throw new ApiError(500, "Error uploading images to Cloudinary");
    }

    const user = await User.create({
        username,
        email,
        password,
        fullName,
        profilePicture: avatarUploadResponse.url,
        coverPhoto: coverPhotoUploadResponse.url || ""
    });
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

});
