import { Router } from 'express'
import * as Users from '../controllers/users'

const router = Router()

router
    .get('/users/check_auth', Users.checkAuth)
    .get('/users/login', Users.login)
    .post('/users/logout', Users.logout)
    .get('/callback', Users.spotifyCallback)

export default router

