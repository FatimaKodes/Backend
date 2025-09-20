import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { v2 as cloudinary } from "cloudinary"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)
    
    const sortOrder = sortType? parseInt(sortType, 10) : -1

    const filter = {};
    if(query) {
        filter.$or = [
            {title:({$regex: query, $options: 'i'})},
            {description:({$regex: query, $options: 'i'})}
    ]}
    if(userId) {
        filter.owner = userId
    }
    
    const videos = await Video.find(filter)
    .sort({[sortBy]: sortOrder})
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)

    const totalVideos = await Video.countDocuments(filter)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {videos,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                totalVideos,
                totalpages: Math.ceil(totalVideos / limitNumber)
            }},
            'Videos fetched successfully'
        )
    )

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if(!title || !description) {
        throw new ApiError(400, 'Title or description are missing')
    }

    let videoLocalPath;
    if (req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0){
        videoLocalPath = req.files.videoFile[0].path;
    }
    if (!videoLocalPath) {
        throw new ApiError(400, 'Video files is missing')
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)

    if(!videoFile) {
        throw new ApiError(400, 'Error while uploading a video file')
    }

    const duration = Math.floor(videoFile.duration)

    let thumbnail;

    let thumbnailLocalPath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0){
        thumbnailLocalPath = req.files.thumbnail[0].path;
    }

if (thumbnailLocalPath) {
    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnailFile) throw new ApiError(400, 'Error while uploading a thumbnail file');
    thumbnail = {url: thumbnailFile.secure_url};
} else {
    // fallback if no thumbnail uploaded
    thumbnail = {url:videoFile.secure_url.replace('/upload/', '/upload/so_5/') + '.jpg'};
}
    const newVideo = await Video.create({
        videoFile: videoFile.secure_url,
        thumbnail,
        title,
        description,
        duration,
        owner: req.user?._id
    })

    if(!newVideo) {
        throw new ApiError(400, 'Something went wrong while creating the video')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        newVideo,
        'Video uploaded successfully'
    ))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    const video = await Video.findById(videoId)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        video.videoFile,
        'Video fetched successfully'
    ))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    const video = await Video.findById(videoId)

    const {title, description} = req.body
    if(title) {
        video.title = title
    }
    if(description) {
        video.description = description
    }
    if(req.file?.path){
    const thumbnailLocalPath = req.file?.path
    const video = await Video.findById(videoId)
    if(video?.thumbnail?.public_url) {
        await cloudinary.uploader.destroy(video.thumbnail.public_id)
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail.url) {
        throw new ApiError(400, 'Error while uploading a thumbnail')
    }
    video.thumbnail = {
        url: thumbnail.url,
        public_id: thumbnail.public_id
    }
}
    await video.save()
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        video,
        'Video updated successfully'
    ))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findByIdAndDelete(videoId)

    if(!video) {
        throw new ApiError(400, 'Video not found')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        'Video deleted successfully'
    ))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(400, 'Video not found')
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        video,
        'Publish status toggled successfully'
    ))
})


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}