import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import  uploadOnCloudinary from '../config/cloudinary.js';

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

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;


    if(!avatarLocalPath ){
        throw new ApiError(400, "Avatar is required");
    }

    const avatarUploadResponse = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUploadResponse = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatarUploadResponse ) {
        throw new ApiError(500, "Error uploading images to Cloudinary");
    }

    const user = await User.create({
        username,
        email,
        password,
        fullName,
        avatar: avatarUploadResponse.url,
        coverImage: coverImageUploadResponse?.url || ""
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
