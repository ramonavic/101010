import { Router } from 'express'
import * as Playlists from '../controllers/playlists'
import { spotifyAuthCheck } from '../authCheck'

const router = Router()

router
    .get('/playlists/index/', spotifyAuthCheck, Playlists.index)

export default router

