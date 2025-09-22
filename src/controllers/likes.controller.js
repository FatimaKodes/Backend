import mongoose, {isValidObjectId} from "mongoose"
import {Likes} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId = req.user?._id

    let isLiked;
    const existedLike = await Likes.findOne({video: videoId, likedBy: userId})
    if(existedLike) {
        await Likes.deleteOne({_id: existedLike._id})
        isLiked= false
    } else {
        await Likes.create({
            video: videoId,
            likedBy: userId
        })
        isLiked= true
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        isLiked,
        'Like on video toggled successfully'
    ))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user?._id

    let isLiked;
    const existedLike = await Likes.findOne({comment: commentId, likedBy: userId})
    if(existedLike) {
        await Likes.deleteOne({_id: existedLike._id})
        isLiked= false
    } else {
        await Likes.create({
            comment: commentId,
            likedBy: userId
        })
        isLiked= true
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        isLiked,
        'Like on comment toggled successfully'
    ))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user?._id

    let isLiked;
    const existedLike = await Likes.findOne({tweet: tweetId, likedBy: userId})
    if(existedLike) {
        await Likes.deleteOne({_id: existedLike._id})
        isLiked= false
    } else {
        await Likes.create({
            tweet: tweetId,
            likedBy: userId
        })
        isLiked= true
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        isLiked,
        'Like on tweet toggled successfully'
    ))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const userId = req.user?._id

    const likedVideos = await Likes.find({likedBy: userId,video:{$ne:null}})
    .populate({
        path: 'video',
        select: 'title thumbnail -_id'
    })
    if(!likedVideos || likedVideos.length === 0) {
        throw new ApiError(400, 'There are no any videos liked by you')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        likedVideos,
        'Liked videos fetched successfully'
    ))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}