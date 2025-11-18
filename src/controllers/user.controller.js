import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

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

export { registerUser };
