import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createTweet, deleteFeatureFromTweet, 
        deleteTweet, getUserTweets, updateTweet 
        } from "../controllers/tweet.controller.js";


const router = Router()
router.use(verifyJWT)

router.route('/')
.post(
    upload.fields([
        {
            name: 'image1',
            maxCount: 1
        },
        {
            name: 'image2',
            maxCount: 1
        },
        {
            name: 'gif',
            maxCount: 1
        },
        {
            name: 'video',
            maxCount: 1
        }
    ]),
    createTweet
)

router.route('/get/:userId')
.get(getUserTweets)

router.route('/delete/:tweetId')
.delete(deleteTweet)

router.route('/update/:tweetId')
.patch(
    upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'gif', maxCount: 1 }
  ]),updateTweet)

  router.route('/deleteFeature/:tweetId')
  .patch(
    upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'gif', maxCount: 1 }
  ]),
  deleteFeatureFromTweet
  )

export default router