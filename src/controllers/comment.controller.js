import mongoose from "mongoose"
import {Comment} from "../models/comments.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)

    const videoComments = await Comment.find({video: videoId})
    .populate({
        path: 'video',
        select: 'title thumbnail owner -_id',
        populate: {
            path: 'owner',
            select: 'username fullName avatar -_id'
        }
    })
    .skip((pageNumber-1) *limitNumber)
    .limit(limitNumber)

    if(!videoComments) {
        throw new ApiError(400, 'There are no comments on the video')
    }

    const totalComments = await Comment.countDocuments(videoComments)
    
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {videoComments,
        pagination: {
            page: pageNumber,
            limit: limitNumber,
            totalComments,
            totalpages: Math.ceil(totalComments / limitNumber)
        }},
        'Video comments fetched successfully'
    ))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {commentBody} = req.body

    if(!commentBody) {
        throw new ApiError(400, 'Create a comment to add it')
    }

    const videoComment = await Comment.create({
        content: commentBody,
        owner: req.user?._id,
        video: videoId
    })

    if(!videoComment) {
        throw new ApiError(400, 'Comment creation failed')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        videoComment,
        'Video comment created successfully'
    ))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {commentBody} = req.body

    if(!commentBody) {
        throw new ApiError(400, 'Something went wrong while getting your update')
    }

    const videoComment = await Comment.findById(commentId)

    if(!videoComment) {
        throw new ApiError(400, 'Comment does not exist')
    }
    videoComment.content = commentBody
    videoComment.save()
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        videoComment,
        'Video comment updated successfully'
    ))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    const videoComment = await Comment.findByIdAndDelete(commentId)

    if(!videoComment) {
        throw new ApiError(400, 'Comment deletion failed')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        'Video comment deleted successfully'
    ))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }