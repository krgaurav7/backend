import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Tweet} from "../models/tweets.model.js"
import { User } from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user._id;

    //const user = await User.findById(userId);
    //TODO: toggle like on video

    if(!userId){
        throw new ApiError("unauthroized", 401);
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError("Video not found", 404);
    }

    const like = await Like.findOne({video : videoId, likedBy : userId});

    let data;
    if(!like){
        data = await Like.create(
           { 
            video : videoId,
            likedBy: userId
           }
        )
    } else {
        data = await Like.findByIdAndDelete(like._id);
    }

    const response = new ApiResponse(200, "like toggle success", data);

    return res.status(200).json(response);
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError("comment not found", 400);
    }

    let data;
    const like = await Like.findOne({comment : commentId , likedBy : req.user._id});

    if(!like){
        data = await Like.create(
            {
                comment : commentId,
                likedBy : req.user._id
            }
        )
    } else {
        data = await Like.findByIdAndDelete(like._id);
    }

    const response = new ApiResponse(200, "toggle comment success", data);

    return res.status(200).json(response);
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError("comment not found", 400);
    }

    let data;
    const like = await Like.findOne({tweet : tweetId , likedBy : req.user._id});

    if(!like){
        data = await Like.create(
            {
                tweet : tweetId,
                likedBy : req.user._id
            }
        )
    } else {
        data = await Like.findByIdAndDelete(like._id);
    }

    const response = new ApiResponse(200, "toggle tweet success", data);

    return res.status(200).json(response);
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id

    const data = await Like.find(
        {
            likedBy:userId,
            video: { $exists: true }
        });

    if(data.length === 0){
        throw new ApiError("No video like till now!", 400);
    }

    const result = new ApiResponse(200, "Liked video fetch success", data);

    return res.status(200).json(result);
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}