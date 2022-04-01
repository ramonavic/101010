import { Router } from 'express'
import * as Users from '../controllers/users'
import { spotifyAuthCheck } from '../authCheck'

const router = Router()

router
    .get('/users/check_auth', Users.checkAuth)
    .get('/users/connect_spotify', Users.connectSpotify)
    .post('/users/logout', Users.logout)
    .get('/callback', Users.spotifyCallback)
    .post('/users/register', Users.register)
    .post('/users/jwt_login', Users.jwtLogin)
    .post('/users/request_login', Users.requestLogin)

export default router

