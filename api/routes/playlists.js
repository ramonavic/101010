import { Router } from 'express'
import * as Playlists from '../controllers/playlists'
import { spotifyAuth } from '../auth'

const router = Router()

router
    .get('/playlists/get_playlist/:id', spotifyAuth, Playlists.getPlaylist)
    .get('/playlists/index/', spotifyAuth, Playlists.index)
    .post('/admin/add_playlist', spotifyAuth, Playlists.add)

export default router

