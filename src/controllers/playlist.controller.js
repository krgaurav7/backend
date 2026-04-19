import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!name){
        throw new ApiError("Playlist name require", 400);
    }
    if(!description){
        throw new ApiError("Description Required", 400);
    }

    const userId = req.user._id;
    if(!userId){
        throw new ApiError("Invalid User", 400);
    }

    const playlistCreate = await Playlist.create(
        {
            name : name.trim(),
            description : description.trim(),
            owner : userId,
            videos : []
        }
    )

    const createdPlaylist = await Playlist.findById(playlistCreate._id).populate(
        "owner",
        "username fullName avatar"
    )

    if(!createdPlaylist){
        throw new ApiError("Failed to create playlist", 400);
    }

    const result = new ApiResponse(201, "Playlist Created", createdPlaylist);

    return res.status(200).json(result);
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError("Invalid userId", 400);
    }

    const playlist = await Playlist.find({
        owner : new mongoose.Types.ObjectId(userId)
    }).populate("owner", "username fullname avatar");

    const result = new ApiResponse(200, "Playlist fetch Successfully", playlist);

    return res.status(200).json(result);
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
        throw new ApiError("Invalid Playlist", 400);
    }

    const playlistdetails = await Playlist.find(playlistId)
        .populate({
            path: "videos",
            populate: {
                path: "owner",
                select: "username fullName avatar"
            }
        })
        .populate("owner", "username fullName avatar")

    if(!playlistdetails){
        throw new ApiError("Playlist nor found", 404);
    }

    const result = new ApiResponse(200, "Playlist Fetch Success", playlistdetails);

    return res.status(200).json(result);
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const userId = req.user._id;

    if(!isValidObjectId(playlistId)){
        throw new ApiError("Invalid Playlist", 400);
    }
    if(!userId){
        throw new ApiError("Invalid User", 400);
    }
    if(!videoId){
        throw new ApiError("Video Needed", 401);
    }

    const playlist = await Playlist.findById(playlistId);

    if(playlist.owner.toString() !== userId.toString()){
        throw new ApiError("You have not access to add Video to Playlist", 401);
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError("Video nor=t found", 400);
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError("Video already exists in playlist", 400);
    }
    
    // method 1 to push video 
    // playlist.videos.push(videoId)
    // await playlist.save()

    // method 2
    const addVideo = await Playlist.findByIdAndUpdate(playlistId, {$push : {videos : videoId}}, {new : true})
        .populate("videos", "title thumbnail duration");

    const result = new ApiResponse(200, "Video Added", addVideo);

    return res.status(200).json(result);
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    const userId = req.user._id;

    if(!isValidObjectId(playlistId)){
        throw new ApiError("Invalid Playlist", 400);
    }
    if(!userId){
        throw new ApiError("Invalid User", 400);
    }
    if(!videoId){
        throw new ApiError("Video Needed", 401);
    }

    const playlist = await Playlist.findById(playlistId);

    if(playlist.owner.toString() !== userId.toString()){
        throw new ApiError("You have not access to add Video to Playlist", 401);
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError("Video nor=t found", 400);
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError("Video not exists in playlist", 400);
    }

    const updatePlaylist = await Playlist.findByIdAndUpdate(playlistId, {$pull : {videos : videoId}}, {new : true})
    
    const result = new ApiResponse(200, "Video Deleted", updatePlaylist);
    
    return res.status(200).json(result);
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError("Invalid PlaylistID",400);
    }

    const userId = req.user._id;
    if(!userId){
        throw new ApiError("Invalid User", 400);
    }

    const playlistDetails = await Playlist.findById(playlistId);
    if (!playlistDetails) {
    throw new ApiError("Playlist not found", 404);
    }

    if(playlistDetails.owner.toString() !== userId.toString()){
        throw new ApiError("You had not permission to Delete Playlist", 403);
    }

    const deletePlaylist = await Playlist.findByIdAndDelete(playlistId);

    const result = new ApiResponse(200, "Playlist Deleted", deletePlaylist);

    return res.status(200).json(result);
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError("Invalid PlaylistID",400);
    }

    const userId = req.user._id;
    if(!userId){
        throw new ApiError("Invalid User", 400);
    }

    const playlistDetails = await Playlist.findById(playlistId);
    if (!playlistDetails) {
    throw new ApiError("Playlist not found", 404);
    }

    if(playlistDetails.owner.toString() !== userId.toString()){
        throw new ApiError("You had not permission to update Playlist", 403);
    }

    const playlistUpdate = await Playlist.findByIdAndUpdate(playlistId, {
        name: name.trim(),
        description: description.trim()
    },
    {new : true}
    ).populate("owner", "username fullName avatar")

    const result = new ApiResponse(200, "Playlist success", playlistUpdate);

    return res.status(200).json(result);
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}