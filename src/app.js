import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))

import registerRoute from './routes/register.route.js'
import videosRoute from './routes/videos.route.js'
import playlistRoute from './routes/playlist.route.js'
import tweetRoute from './routes/tweet.route.js'
import subscriptionRoute from './routes/subscription.route.js'
import likesRoute from './routes/likes.route.js'
import commentRoute from './routes/comment.route.js'

app.use('/api/v1/users', registerRoute)
app.use('/api/v1/videos', videosRoute)
app.use('/api/v1/playlist', playlistRoute)
app.use('/api/v1/tweet', tweetRoute)
app.use('/api/v1/subscription', subscriptionRoute)
app.use('/api/v1/likes', likesRoute)
app.use('/api/v1/comment', commentRoute)

export default app;