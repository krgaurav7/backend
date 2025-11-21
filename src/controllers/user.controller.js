import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"


// making a default function to generate access and refresh token 
const generateAccessanndRefreshToken = async (userId) => {

  try {
    const user = await User.findById(userId)

    const AccessToken = await user.generateAccessToken();
    const RefreshToken = await user.generateRefreshToken();

    //console.log(AccessToken);
    //console.log(RefreshToken);

    user.refreshTokens = RefreshToken;
    await user.save({validateBeforeSave : false}); // svae user without valoidation

    return {AccessToken , RefreshToken}; // return both generated token

  } catch (error) {
    throw new ApiError("Something went wrong while generating refresh and access token", 500);
  }
}

const registerUser = asyncHandler(async (req, res) => {
  
  const { username, email, fullName, password } = req.body;

  // 1. Validate input
  if (!username) {
    throw new ApiError("username fields are required", 400);
  }
  if (!email) {
    throw new ApiError("email fields are required", 400);
  }
  if (!fullName) {
    throw new ApiError("fullName fields are required", 400);
  }
  if (!password) {
    throw new ApiError("password fields are required", 400);
  }

  // 2. Check if user exists
  const existedUser = await User.findOne(
    {
        $or: [{ email }, { username }],
    });

  if (existedUser) {
    throw new ApiError(
      "User with given email or username already exists",
      409
    );
  }

  // 3. Get uploaded files
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError("Avatar image is required", 400);
  } else {
    console.log(avatarLocalPath);
  }

  // 4. Upload avatar + coverImage to Cloudinary

  const avatarUploadResponse = await uploadonCloudinary(avatarLocalPath);
  //console.log(avatarUploadResponse);

  const coverImageUploadResponse = await uploadonCloudinary(coverImageLocalPath);
  //console.log(coverImageUploadResponse);

// check avatar success only
if (!avatarUploadResponse) {
  throw new ApiError("Failed to upload avatar image on Cloudinary", 500);
}

  // 5. Create user
  const newUser = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatarUploadResponse.url,
    coverImage: coverImageUploadResponse?.url || "",
  });

  // remove password before response
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshTokens"
  );

  if (!createdUser) {
    throw new ApiError("Failed to create user", 500);
  }

  const response = new ApiResponse(
    201,
    "User registered successfully",
    createdUser
  );

  return res.status(201).json(response);
});


const loginUser = asyncHandler(async (req, res) => {
    //req body data
    //username or email must needed
    //if user exist 
    //check password
    //generate access and refresh token generate
    // send cookies
    //given them a response that user is login success

  const {username, email, password} = req.body;

  if(!username || !email){
    throw new ApiError("Username or Email is required foe login", 400);
  }

  if(!password){
    throw new ApiError("Password is must required" , 401);
  }

  const user = await User.findOne({
    $or : [{email}, {username}]
  })

  if(!user){
    throw new ApiError("User not exist with this username and Email", 404);
  }

  const passValid = await user.isPasswordCorrect(password);

  if(!passValid){
    throw new ApiError("Password entered is wrong", 408);
  }

  // to generaet access and refreh token, make a seprate a function
  const {AccessToken, RefreshToken} = await generateAccessanndRefreshToken(user._id);
  // now have both token and we saved refresh token to db
  const loggnedUser = await User.findOne(user._id).select("-password -refreshToken");// .select - the field we don't want remove them
  
  const options = {
    httpOnly : true,
    secure : true
  } //this help that no one acept server will modified cookies
  
  return res.status(200)
  .cookie("accessToken", AccessToken, options)
  .cookie("refreshToken", RefreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user : loggnedUser, AccessToken , RefreshToken
      },
      "User Logged in Successfully"
    )
  );

});

const logoutUser = asyncHandler( async (req, res) => {

  await User.findByIdAndUpdate(
    req.user._id,{
      $set: {
        refreshTokens: undefined
      }
    },{
      new: true
    }
  )

    const options= {
      httpOnly:true,
      secure:true
    }

    return res.status(200)
    .clearCookie("refreshTokens", options)
    .clearCookie("accessTokens", options).
    json(new ApiResponse(200, {message : "success"}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res)=> {
  // i have refresh token in db
  // we need to access refresh token from cookies

  const incomingRefreshToken = await req.cookie.refreshTokens||req.body.refreshTokens;

    if(!incomingRefreshToken){
      throw new ApiError(401, "Unable to acrress the Refresh Token");
    }

  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  const id = decodedToken._id;

  if(!id){
    throw new ApiError(401, "Unable to verify token");
  }

  const user= await User.findById(id);

  if(!user){
    throw new ApiError(401, "Invalid Refresh token");
  }

  if(incomingRefreshToken !== user.refreshTokens){
    throw new ApiError(402, "expire refresh token");
  }

  const options = {
    httpOnly:true,
    secure : true
  }
  const {newAccessToken, newRefreshToken} = await generateAccessanndRefreshToken(user.id);

  return res
  .status(200)
  .cookie("accessToken", newRefreshToken, options)
  .cookie("refreshToken", newAccessToken, options)
  .json(
    new ApiResponse(
      200,
      {
        newAccessToken,
        newRefreshToken
      },
      "Access Token refresh Successfully"
    )
  )
  
})


export { registerUser, loginUser, logoutUser, refreshAccessToken};
