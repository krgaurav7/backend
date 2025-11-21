import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
dotenv.config();

const verifyJWT = asyncHandler(async (req, res, next) => {
  
  //console.log(req.cookies.accessToken);

  const token =
    await req.cookies?.accessToken || 
    req.header("Authorization")?.replace("Bearer ","");
  //console.log(token);

  if (!token) {
    throw new ApiError("Unauthorized Request", 401);
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!decodedToken) {
    throw new ApiError("Invalid Token", 401);
  }

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  req.user = user;
  next();
});

export { verifyJWT };
