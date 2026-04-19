import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {subscription, Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    //  * Features:
    //  * - Total video views (sum of all video views)
    //  * - Total subscribers count
    //  * - Total videos count (published and unpublished)
    //  * - Total likes on all videos
    //  * - Uses MongoDB aggregation for efficient calculation 

    const {channelId} = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError("Invalid Channel", 400);
    }
    // total views
    const totalViewResults = await Video.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum : "$views"}
            }
        }
    ])

    // total subscriber count
    const subscribersCount = await subscription.countDocuments({
        channel: new mongoose.Types.ObjectId(channelId) 
    });
    if(!subscribersCount){
        throw new ApiError("Invalid Channel", 400);
    }

    // total videos count
    const totalVideos = await Video.countDocuments({
        owner: new mongoose.Types.ObjectId(channelId)
    });
    if(!totalVideos){
        throw new ApiError("Invalid Channel", 400);
    }

    // getall video Ids
    const channelVideos = await Video.find({
        owner : channelId
    }).select("_id");

    const videoIds = channelVideos.map(video => video._id) // map return an array
    // count total like on videos
    const totalLikes = await Like.countDocuments(
        {
            video : {$in: videoIds}
        }
    )

    const stat = {
        totalLikes,
        totalVideos,
        subscribersCount,
        totalViews
    }

    const result = new ApiResponse(200, "Dashboard Information", stat);

    return res.status(200).json(result);
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError("Invalid Channel", 400);
    }

    const channelVideos = await Video.aggregate([
        {
            $match : {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField:"owner",
                foreignField:"_id",
                as:"ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                owner: { $first :"ownerDetails"}
            }
        },{
            $project : {
                ownerDetails: 0
            }
        },
        {
            $sort : {createdAt : -1}
        }
    ])

    const result = new ApiResponse(200, "Channel Videos", channelVideos);

    return res.status(200).json(result);
})

export {
    getChannelStats, 
    getChannelVideos
}