import { Router } from 'express'
import * as Admin from '../controllers/admin'
import { spotifyAuthCheck } from '../authCheck'

const router = Router()

// TODO add Admin check middleware

router
    .get('/admin/get_playlist/:id', spotifyAuthCheck, Admin.getPlaylist)
    .post('/admin/add_playlist', spotifyAuthCheck, Admin.addPlaylist)
    .get('/admin/fetch_tags', Admin.getTags)
    .post('/admin/add_tags_to_playlist', Admin.addTagsToPlaylist)

export default router

