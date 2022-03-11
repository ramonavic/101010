import { Router } from 'express'
import * as Users from '../controllers/users'

const router = Router()

router
    .get('/users/check_auth', Users.checkAuth)
    .get('/users/connect_spotify', Users.connectSpotify)
    .post('/users/logout', Users.logout)
    .get('/callback', Users.spotifyCallback)
    .post('/users/register', Users.register)
    .post('/users/jwt_login', Users.jwtLogin)

export default router

