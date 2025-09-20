import mongoose, {Schema} from "mongoose";

const tweetSchema = new Schema({
    content: {
        message: String,
        image1: Object,
        image2: Object,
        gif: Object,
        video: Object
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

export const Tweet = mongoose.model('Tweet', tweetSchema)