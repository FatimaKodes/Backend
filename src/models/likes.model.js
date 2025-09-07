import mongoose, {Schema} from 'mongoose'

const likeSchema = new Schema({
    video: {
        type: mongoose.Types.ObjectId,
        ref: 'Video'
    },
    tweet: {
        type: mongoose.Types.ObjectId,
        ref: 'Tweet'
    },
    comment: {
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    },
    likedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

export const Likes = mongoose.model('Likes', likeSchema)