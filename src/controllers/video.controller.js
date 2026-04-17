import mongoose, {isValidObjectId, mongo} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const startIndex = (pageNum - 1) * limitNum;

    // 2. Validate sortBy (whitelist)
    const allowedSortFields = ["createdAt", "views", "title", "duration"];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    // 3. Validate sortType
    const validSortType = sortType === "asc" ? 1 : -1;

    // 4. Build filter
    const filter = { isPublished: true };

    // Add search query if provided
    if (query?.trim()) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    // Add userId filter if provided
    if (userId) {
        filter.owner = userId;
    }

    // 5. Get total count (use countDocuments, not find!)
    const totalVideos = await Video.countDocuments(filter);  // ✓ Returns number
    const totalPages = Math.ceil(totalVideos / limitNum);

    // 6. Fetch videos with proper sorting
    const videos = await Video.find(filter)
        .skip(startIndex)
        .limit(limitNum)
        .sort({ [validSortBy]: validSortType });  // ✓ Fixed: dynamic sort

    // 7. Check if videos found
    if (!videos || videos.length === 0) {
        return res.status(200).json(new ApiResponse(200, {
            videos: [],
            pagination: {
                currentPage: pageNum,
                totalPages: 0,
                totalVideos: 0,
                videosPerPage: limitNum
            }
        }, "No videos found"));
    }

    const response = new ApiResponse(200, 
        "Videos fetched successfully" ,
        {
        videos,
        pagination: {
            currentPage: pageNum,
            totalPages,
            totalVideos,
            videosPerPage: limitNum,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        }
    });

    return res.status(200).json(response);
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    const userId = req.user._id
    // TODO: get video, upload to cloudinary, create video

    if(!title){
        throw new ApiError("Title required", 400)
    }
    
    if(!description){
        throw new ApiError("Description required" , 400)
    }

    const videofile = req.files?.videoFile?.[0]?.path
    const thumbnailfile = req.files?.thumbnail?.[0]?.path

    if(!videofile){
        throw new ApiError("Video file needed", 400)
    }

    if(!thumbnailfile){
        throw new ApiError("thumbnail file needed", 400)
    }

    const videofileResponse = await uploadOnCloudinary(videofile);
    const thumbnailuploadResponse = await uploadOnCloudinary(thumbnailfile);

    if(!videofileResponse){
        throw new ApiError("failed to upload video file" , 400);
    }

    if(!thumbnailuploadResponse){
        throw new ApiError("failed to upload video file" , 400);
    }

    const duration = videofileResponse.duration || 0;
    const videoFile = videofileResponse.url
    const thumbnail = thumbnailuploadResponse.url
    const owner = userId


    const video = await Video.create({
        videoFile,
        thumbnail,
        owner,
        title,
        description,
        duration,
        isPublished: true
    })

       // Fetch created video with owner details
    const createdVideo = await Video.findById(video._id).populate(
        "owner",
        "username fullName avatar"
    )

    if (!createdVideo) {
        throw new ApiError(500, "Failed to create video")
    }

    const response = new ApiResponse(200, "File uploaded", createdVideo);

    return res.status(201).json(response)
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    //const userId = req.user._id
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError("Video not found", 400)
    }

    const response = new ApiResponse(200, "Video fetch success", video)

    return res.status(200).json(response)
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {description, title} = req.body
    const userId = req.user._id

    const thumbnailpath = req.files?.thumbnail?.[0]?.path;

    if (!thumbnailpath) {
        throw new ApiError("thumbnail image is required", 400);
    } else {
        console.log(thumbnailpath);
    }

    // if thumbnail is provided only then update it
    const thumbnailuploadResponse = await uploadonCloudinary(thumbnailpath); 

    const vid = await Video.findById(videoId);

    if(vid.owner.toString() !== userId.toString()){
        throw new ApiError("unauthrozied user" , 403)
    }

    const data = await Video.findByIdAndUpdate(
        videoId,
        {thumbnail : thumbnailuploadResponse.url, title, description},
        {new : true}
    )

    const response = new ApiResponse(201, "successfully updated" , data)

    return res.status(200).json(response);
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._id
    
    const user = await User.findById(userId);

    if(!user){
        throw new ApiError("Invalid user", 405);
    }
    //TODO: delete video
    if(!videoId){
        throw new ApiError("Video not found", 400);
    }

    const d = await Video.findByIdAndDelete(videoId);

    if(d.owner.toString() !== userId.toString()){
        throw new ApiError("unauthorized user", 403)
    }

    const response = new ApiResponse(201, "Video deleted" , d);

    return res.status(200).json(response)
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._id

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError("Video not found", 404);
    }

    if(userId.toString() !== video.owner.toString()){
        throw new ApiError("Not valid user" , 400);
    }

   const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {isPublished : !video.isPublished},
    {new : true}
   )

    const response = new ApiResponse(201,  `Video ${updatedVideo.isPublished ? "published" : "unpublished"} successfully`, data)

    return res.status(200).json(response);
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}