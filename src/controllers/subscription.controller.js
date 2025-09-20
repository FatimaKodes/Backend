import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const viewerId = req.user?._id

    let isSubscribed;
    const existedSubscript = await Subscription.findOne
    ({subscriber: viewerId, channel: channelId})
    
    if(existedSubscript) {
        await Subscription.deleteOne({_id: existedSubscript._id})
        isSubscribed= false
    } else {
        await Subscription.create({ subscriber: viewerId, channel: channelId })
        isSubscribed= true
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        isSubscribed,
        'Subscription toggled successfully'
    ))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const subscriberCount = await Subscription.countDocuments({channel: channelId})

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        subscriberCount,
        'Subscribers list fetched successfully'
    ))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const subscribedToCount = await Subscription.countDocuments({subscriber: subscriberId})

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        subscribedToCount,
        'Subscribed channels list fetched successfully'
    ))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}