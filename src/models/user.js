import mongoose from "mongoose";
const {Schema} = mongoose;
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

//Password hashing middleware
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, parseInt(process.env.Iteration) )
    next()
})


//Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}


//Generate JWT token method
userSchema.methods.generateJWT = function() {
    const payload = {
        id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
    return token
}


//Generate Refresh token method
userSchema.methods.generateRefreshToken = function() {
    const payload = {
        id: this._id,
        username: this.username,
    }
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN})
    return refreshToken
}


export const User = mongoose.model("User", userSchema)