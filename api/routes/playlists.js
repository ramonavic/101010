import { Router } from 'express'
import * as Playlists from '../controllers/playlists'
import { spotifyAuthCheck } from '../authCheck'

const router = Router()

router
    .get('/playlists/get_playlist/:id', spotifyAuthCheck, Playlists.getPlaylist)
    .get('/playlists/index/', spotifyAuthCheck, Playlists.index)
    .post('/admin/add_playlist', spotifyAuthCheck, Playlists.add)

export default router

