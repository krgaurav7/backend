import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    // validate channelID
    if(!isValidObjectId(channelId)){
        throw new ApiError("Invalid Channel ID", 400);
    }

    // check self-subscription
    if(channelId === req.user._id.toString()){
        throw new ApiError("You cannot subscribe your own channel", 400);
    }

    // check channel exist
    const channel = await subscription.findById(channelId);
    if(!channel){
        throw new ApiError("Channel not exist", 400);
    }

    const existSubscription  = await subscription.findOne({
        subscriber : req.user._id,
        channel : channelId
    })

    if(existSubscription ){
        const data = await subscription.findByIdAndDelete(existSubscription ._id);

        const result = new ApiResponse(200, "Channel Unsubscribed", data);

        return res.status(201).json(result);
    }

    const data = await subscription.create(
        {
            subscriber : req.user._id,
            channel : channelId
        }
    )

    const result = new ApiResponse(200, "Subscribed", data);

    return res.status(201).json(result);
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    // validate channelID
    if(!isValidObjectId(channelId)){
        throw new ApiError("Invalid Channel Id", 400);
    }

    const channel = await subscription.findById(channelId);
    if(!channel){
        throw new ApiError("Channel not exist", 400);
    }

    const subscribers = await subscription.aggregate([
        {
            $match: {
                channel : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as:"subscriber",
                pipeline: [
                    {
                        $project : {
                            username :1,
                            fullname :1,
                            avatar :1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscriber :1,
                subscribedAt : "$createdAt"
            }
        },
        {
            $sort : {
                subscribedAt : -1 // most recent subscription first
            }
        }
    ])

    const result = new ApiResponse(200, "Subscriber details fetch success", subscribers);

    return res.status(200).json(result);
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError("Invalid SubscriberId", 400);
    }

    const subscriber = await User.findById(subscriberId);
    if(!subscriber){
        throw new ApiError("Invalid Subscriber", 400);
    }

    const channels = await subscription.aggregate([
        {
            $match: {
                subscriber  : new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline : [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1,
                            coverImage: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                channel: {
                    $first :"$channel"
                }
            }
        },
        {
            $project: {
                channel: 1,
                subscribedAt: "$createdAt"
            }
        },
        {
            $sort: {subscribedAt :-1}
        }
    ])

    const result = new ApiResponse(200, "Channel data fetch", channels);

    return res.status(200).json(result);
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}