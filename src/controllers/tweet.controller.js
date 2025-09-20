import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { v2 as cloudinary } from "cloudinary"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {contentText} = req.body

    const content = {}

    if(contentText) {
        content.message = contentText
    }
    

    if(req.files?.image1) {
        const imageLocalPath = req.files.image1[0].path
        const uploadedImage = await uploadOnCloudinary(imageLocalPath)
        if(!uploadedImage) {
            throw new ApiError(400, 'Something went wrong while uploading image')
        }
        const imageInfo = {
            url: uploadedImage.secure_url,
            public_id: uploadedImage.public_id,
            width: uploadedImage.width,
            height: uploadedImage.height,
            format: uploadedImage.format
        }
        content.image1 = imageInfo

    }
    if(req?.files?.image1?.length>1) {
        throw new ApiError(400, 'You can tweet just one image1')
    }


    if(req.files?.image2) {
        const imageLocalPath = req.files.image2[0].path
        const uploadedImage = await uploadOnCloudinary(imageLocalPath)
        if(!uploadedImage) {
            throw new ApiError(400, 'Something went wrong while uploading image')
        }
        const imageInfo = {
            url: uploadedImage.secure_url,
            public_id: uploadedImage.public_id,
            width: uploadedImage.width,
            height: uploadedImage.height,
            format: uploadedImage.format
        }
        content.image2 = imageInfo
        
    }
    if(req?.files?.image2?.length>1) {
        throw new ApiError(400, 'You can tweet just one image2')
    }
    


    if(req?.files?.gif) {
        const gifLocalPath = req.files.gif[0].path
        const gif = await uploadOnCloudinary(gifLocalPath)
        if(!gif) {
            throw new ApiError(400, 'Something went wrong while uploading gif')
        }
        const imageInfo = {
            url: gif.secure_url,
            public_id: gif.public_id,
            width: gif.width,
            height: gif.height,
            format: gif.format
        }
        content.gif = imageInfo
        
    }
    if(req?.files?.gif?.length>1) {
        throw new ApiError(400, 'You can tweet just one GIF')
    }
    


    if(req.files?.video) {
        const videoLocalPath = req.files.video[0].path
        const video = await uploadOnCloudinary(videoLocalPath)
        if(!video) {
            throw new ApiError(400, 'Something went wrong while uploading video')
        }
        const imageInfo = {
            url: video.secure_url,
            public_id: video.public_id,
            width: video.width,
            height: video.height,
            format: video.format
        }
        content.video = imageInfo
        
    }
    if(req?.files?.video?.length>1) {
        throw new ApiError(400, 'You can tweet just one video')
    }
    

    if(!content.message && !content.image1 && !content.gif && !content.video && !content.image1) {
        throw new ApiError(400, 'Tweet must contain text or media')
    }
    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })

    if(!tweet) {
        throw new ApiError(400, 'Something went wrong while creating tweet')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        tweet,
        'Tweet created successfully'
    ))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const {userId} = req.params
    if(!userId) {
        throw new ApiError(400, 'UserId is required')
    }

    const tweets = await Tweet.find({owner: userId})
    .populate({
        path: 'owner',
        select: 'username fullName -_id'
    })

    if(!tweets) {
        throw new ApiError(400, 'User tweet does not exist')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        tweets,
        'User tweet fetched successfully'
    ))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const {tweetId} = req.params
    const {message} = req.body

    const tweet = await Tweet.findById(tweetId)

    if(message) {
        tweet.content.message = message
    }

    
    if(req.files?.image1) {
        const imageLocalPath = req.files.image1[0].path
        if(tweet?.content?.image1?.public_url) {
            await cloudinary.uploader.destroy(tweet.content.image1.public_url)
        }
        const image = await uploadOnCloudinary(imageLocalPath)
        if(!image.url) {
            throw new ApiError(400, 'Something went wrong while updating the image')
        }
        const upload = {
            url: image.url,
            public_url: image.public_url,
            width: image.width,
            height: image.height,
            format: image.format
        }
        tweet.content.image1 = upload

    }
    if(req?.files?.image1?.length>1) {
        throw new ApiError(400, 'You can tweet just one image1')
    }

    if(req.files?.image2) {
        const imageLocalPath = req.files.image2[0].path
        if(tweet?.content?.image2?.public_url) {
            await cloudinary.uploader.destroy(tweet.content.image2.public_url)
        }
        const image = await uploadOnCloudinary(imageLocalPath)
        if(!image.url) {
            throw new ApiError(400, 'Something went wrong while updating the image')
        }
        const upload = {
            url: image.url,
            public_url: image.public_url,
            width: image.width,
            height: image.height,
            format: image.format
        }
        tweet.content.image2 = upload

    }
    if(req?.files?.image2?.length>1) {
        throw new ApiError(400, 'You can tweet just one image2')
    }


    if(req.files?.gif && req.files.gif.length >0) {
        const gifLocalPath = req.files.gif[0].path
        if(tweet?.content?.gif?.public_url) {
            await cloudinary.uploader.destroy(tweet.content.gif.public_url)
        }
        const gif = await uploadOnCloudinary(gifLocalPath)
        if(!gif.url) {
            throw new ApiError(400, 'Something went wrong while updating the gif')
        }
        tweet.content.gif = {
            url: gif.url,
            public_url: gif.public_url,
            width: gif.width,
            height: gif.height,
            format: gif.format
        }
        
    }


    if(req.files?.video && req.files.video.length >0) {
        const videoLocalPath = req.files.video[0].path
        if(tweet?.content?.video?.public_url) {
            await cloudinary.uploader.destroy(tweet.content.video.public_url)
        }
        const video = await uploadOnCloudinary(videoLocalPath)
        if(!video.url) {
            throw new ApiError(400, 'Something went wrong while updating the video')
        }
        tweet.content.video = {
            url: video.url,
            public_url: video.public_url,
            width: video.width,
            height: video.height,
            format: video.format
        }
        
    }

    await tweet.save()

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        tweet,
        'Tweet updated successfully'
    ))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const {tweetId} = req.params

    const tweet = await Tweet.findByIdAndDelete(tweetId)
    if(!tweet) {
        throw new ApiError(400, 'Tweet does not exist')
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        'Tweet deleted successfully'
    ))
})

const deleteFeatureFromTweet = asyncHandler(async (req, res) => {
    const {remove} = req.body
    const {tweetId} = req.params

    const twit = await Tweet.findById(tweetId)
    const unsetFields = {}

    for(const field of remove) {
        if(['image1', 'image2', 'gif', 'video'].includes(field)) {
            if(twit?.content?.[field]?.public_url) {
                await cloudinary.uploader.destroy(twit.content[field].public_url)
            }
        }
        unsetFields[`content.${field}`] = 1
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $unset: unsetFields
        },
        {
            new: true
        }
    )

    if(!tweet) {
        throw new ApiError(400, 'Something went wrong while updating the tweet')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        tweet,
        'Tweet updated successfully'
    ))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    deleteFeatureFromTweet
}