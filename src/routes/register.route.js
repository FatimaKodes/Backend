import {changeCurrentPassword,
        getCurrentUser,
        getUserChannelProfile,
        getWatchHistory,
        refreshAccessToken,
        updateAccountDetails,
        updateUserAvatar,
        updateUserCoverImage,
        userLogin,
        userLogout,
        userRegister} 
from '../controllers/user.controller.js'
import { Router } from 'express'
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ])
    ,userRegister)
router.route('/login').post(userLogin)

//secured routes

router.route('/logout').post(verifyJWT, userLogout)

router.route('/refresh-token').post(refreshAccessToken)

router.route('/password').post(verifyJWT, changeCurrentPassword)

router.route('/get-user').get(verifyJWT, getCurrentUser)

router.route('/update-account').patch(verifyJWT, updateAccountDetails)

router.route('/avatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar)

router.route('/cover-image').patch(verifyJWT, upload.single('coverImage'), updateUserCoverImage)

router.route('/c/:username').get(verifyJWT, getUserChannelProfile)

router.route('/history').get(verifyJWT, getWatchHistory)

export default router