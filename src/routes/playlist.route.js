import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {    addVideoToPlaylist, createPlaylist,
            deletePlaylist, getPlaylistById,
            getUserPlaylists, removeVideoFromPlaylist,
            updatePlaylist } from '../controllers/playlist.controller.js'

const router = Router()
router.use(verifyJWT)

router.route('/').post(createPlaylist)

router.route('/:playlistId')
.get(getPlaylistById)
.delete(deletePlaylist)
.patch(updatePlaylist)

router.route('/add/:playlistId/:videoId').patch(addVideoToPlaylist)
router.route('/remove/:playlistId/:videoId').patch(removeVideoFromPlaylist)

router.route('/get/:userId').get(getUserPlaylists)

export default router