import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
    const userId = req.user._id;

    const user = await User.findById(req.user._id);
    
    if(!user){
        throw new ApiError("User not found", 500);
    }

    if(!content){
        throw new ApiError("Write something to tweet", 500);
    }

    const tweet = await new Tweet({
        userId,
        content,
    })
    await tweet.save();

    const response = new ApiResponse(200, "Tweet Success", tweet );

    return res.status(201).json(response)
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user._id;

    if(!userId){
        throw new ApiError("Not valid user" , 400);
    }

    const data = await Tweet.find({owner : userId})

    if(data.length === 0){ // data.length === 0 because whaen there is no tweet it return [] empty array
        throw new ApiError("No Tweet" , 500)
    }

    const response = new ApiResponse(200, "Tweets", data);

    return res.status(201).json(response)
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const userId = req.user._id;
    const tweetId = req.params.tweetId
    const {content} = req.body

    if(!tweetId){
        throw new ApiError("Tweet Id requred for Update Tweet", 401);
    }

    if(!content){
        throw new ApiError("Required new Content", 401)
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError("No tweet found", 400);
    }

    if(tweet.owner.toString() !== userId.toString()){
        throw new ApiError("User verification failed", 400);
    }

    const d = await Tweet.findByIdAndUpdate(tweetId , {content}, {new : true});

    const response = new ApiResponse(200, "Tweet update Successful", d);

    return res.status(200).json(response);
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const userId = req.user._id
    const tweetId = req.params.tweetId

    if(!userId){
        throw new ApiError("Wrong User", 400);
    }
    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError("No tweet found", 400);
    }
    
    if(tweet.owner.toString() !== userId.toString()){
        throw new ApiError("Owner Verification failed", 401);
    }

    const d = await Tweet.findByIdAndDelete(tweetId);

    const response = new ApiResponse(200, "Tweet Delete Success", d);

    return res.status(200).json(response);
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}