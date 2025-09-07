import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    descrition: {
        type: String,
        required: true
    },
    videos: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Video'
        }
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

export const Playlist = mongoose.model('Playlist', playlistSchema)