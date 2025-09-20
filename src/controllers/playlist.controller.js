import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!name) {
        throw new ApiError(400, 'Name is required')
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })

    if(!playlist) {
        throw new ApiError(400, 'Something went wrong while creating the playlist')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        playlist,
        'Playlist created successfully'
    ))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!userId) {
        throw new ApiError(400, 'UserId is missing')
    }
    const userPlaylists = await Playlist.find({owner: userId})
    .populate('videos')
    .populate({
        path: 'owner',
        select: 'username fullName -_id'
    })

    if(!userPlaylists) {
        throw new ApiError(400, 'Something went wrong while fetching the user playlist')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        userPlaylists,
        'User playlist fetched successfully'
    ))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    const playlist = await Playlist.findById(playlistId)
    if(!playlist) {
        throw new ApiError(400, 'Playlist does not exist')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        playlist,
        'Playlist fetched successfully'
    ))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video not found");
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist) {
        throw new ApiError(400, 'Playlist does not exist')
    }

     // Add video to playlist.videos array
    playlist.videos.push(video._id);
    await playlist.save();

    // Populate videos for the response
    await playlist.populate("videos");

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        playlist,
        'Videos added to playlist successfully'
    ))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    const playlist = await Playlist.findById(playlistId)

    if(!playlist) {
        throw new ApiError(400, 'Playlist does not exist')
    }

    if(!videoId) {
        throw new ApiError(400, 'Video does not exist')
    }

    playlist.videos = playlist.videos.filter(
        (video) => {
            video._id !== videoId
        }
    )

    playlist.save()

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        playlist,
        'Video deleted from the playlist successfully'
    ))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!playlistId) {
        throw new ApiError(400, 'Playlist does not exist')
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if(!playlist) {
        throw new ApiError(400, 'Something went wrong while deleting the playlist')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        'Playlist deleted successfully'
    ))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!name && !description) {
        throw new ApiError(400, 'Name or description are missing')
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {
            new: true
        }
    )
    if(!playlist) {
        throw new ApiError(400, 'Something went wrong while updating the playlist')
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        playlist,
        'Playlist updated successfully'
    ))
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