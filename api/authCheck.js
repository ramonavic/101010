import { setCookies } from './controllers/users'
import SpotifyModel from './models/Spotify'

const Spotify = new SpotifyModel()

export const spotifyAuthCheck = async (req, res, next) => {
    if (!req.signedCookies.access_token && req.signedCookies.refresh_token) {
        console.log('no access token', req.signedCookies.refresh_token)
        const authData = await Spotify.getAccessTokenFromRefreshToken(req.signedCookies.refresh_token)
        if (authData.access_token) {
            await setCookies(res, authData)
        } else {
            console.error('Didnt receive access token')
        }
    }

    if (!req.signedCookies.access_token && !req.signedCookies.refresh_token) {
        console.log('No cookies to continue')

        // TODO add this to overall error handler in Vue
        res.status(403).json({ status: 'error', message: 'not authorized in Spotify' })
    }

    next()
}


