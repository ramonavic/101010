import { Router } from 'express'
import * as Admin from '../controllers/admin'
import { spotifyAuthCheck } from '../auth/spotify'
import { adminCheck } from '../auth/admin'


const router = Router()

// TODO add Admin check middleware

router
    .get('/admin/get_playlist/:id', adminCheck, spotifyAuthCheck, Admin.getPlaylist)
    .post('/admin/add_playlist', adminCheck, spotifyAuthCheck, Admin.addPlaylist)
    .get('/admin/fetch_tags', adminCheck, Admin.getTags)
    .post('/admin/add_tags_to_playlist', adminCheck, Admin.addTagsToPlaylist)

export default router

