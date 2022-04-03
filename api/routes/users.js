import { Router } from 'express'
import * as Users from '../controllers/users'
import passport from 'passport'

const router = Router()

router
    .get('/users/check_auth', passport.authenticate('checkAuth', { failureRedirect: '/', failureMessage: true }), Users.authCallback)
    .get('/users/connect_spotify', Users.connectSpotify)
    .post('/users/logout', Users.logout)
    .get('/callback', Users.spotifyCallback)
    .post('/users/register', Users.register)
    .post('/users/jwt_login', passport.authenticate('magicLink', { failureRedirect: '/', failureMessage: true }), Users.authCallback)
    .post('/users/request_login', Users.requestLogin)

export default router

