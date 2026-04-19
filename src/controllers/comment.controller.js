import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const startIndex = (pageNum - 1) * limitNum;

    const totalComments = await Comment.countDocuments({ video: videoId });

    const videoComment = await Comment.find({video : videoId})
                                .skip(startIndex)
                                .limit(limitNum)
                                .sort({ createdAt: -1 });

    if(!videoComment){
        throw new ApiError("No comment found", 404);
    }

    const response = new ApiResponse(200, "Comment fetch success", {
        comments,
        paginaton: {
            currentPage : pageNum,
            totalPage: Math.ceil(totalComments/limitNum),
            totalComments,
            hasNextPage : pageNum < Math.ceil(totalComments/limitNum)
        }
    });

    return res.status(200).json(response);
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params;
    const userId = req.user._id;

    const {content} = req.body;
    if(!content.trim()){
        throw new ApiError("Comment is Empty!", 400);
    }
    const owner = userId;

    const result = await Comment.create({
        content,
        owner, 
        video: videoId
    })

    const response = new ApiResponse(200, "Comment added successful!", result);

    return res.status(200).json(response);
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    //const user = await User.findById(req.user._id);
    // const content = req.Comment.content;
    const {content} = req.body;
    const userId = req.user._id;
    const {commentId} = req.params;

    if(!content){
        throw new ApiError("Comment not found", 400);
    }

    const comment = await Comment.findById(commentId);
    if(comment.owner.toString() !== userId.toString()) {
        throw new ApiError("Unauthorized", 403);
    }

    const result = await Comment.findByIdAndUpdate(commentId , {content : content.trim()}, {new : true});

    if(!result){
        throw new ApiError("Comment not found!", 400);
    }

    const response = new ApiResponse(200, "Comment updated", result);

    return res.status(200).json(response);
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params;

    if(!commentId){
        throw new ApiError("Invalid request!", 400);
    }

    const result = await Comment.findByIdAndDelete(commentId);

    if(!result){
        throw new ApiError("Comment not found", 400);
    }

    const response = new ApiResponse(200, "Comment deleted Successfully", result);

    return res.status(200).json(response);
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}