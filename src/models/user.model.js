import mongoose, {Schema} from "mongoose"; 
import jwt from "jsonwebtoken"; // For generating JWT tokens
import bcrypt from "bcrypt"; // For hashing passwords 

import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true, // Remove whitespace
        index : true, // For faster search
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    }, 
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true,
    },
    avatar : {
        type : String, // URL to the avatar image from cloudnary
        required : true,
    },
    coverImage : {
        type : String,
        required : false,
    }, 
    password : {
        type : String,
        required : [true, "Password is required"],
    },
    refreshTokens : {
        type : String,
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
    updatedAt : {
        type : Date,
        default : Date.now,
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video",
        }
    ]
},{
    timestamps : true,
})

userSchema.pre("save", async function (next) { // Pre-save hook to hash password before saving
    if(!this.isModified("password")) return next(); // If password is not modified, proceed to next middleware

    this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt round of 10
    next();
});

// custom method 
userSchema.methods.isPasswordCorrect = async function (password){  // Compare given password with hashed password
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function(){ // Generate access token
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
        fullName : this.fullName,
    },
        process.env.ACCESS_TOKEN_SECRET, // Secret key
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY || "1d", // Token expiry
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){ // Generate refresh token
    return jwt.sign({
        _id : this._id,
    },
        process.env.REFRESH_TOKEN_SECRET, // Secret key
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY || "1d", // Token expiry
        }
    )
}
export const User = mongoose.model("User", userSchema);