import { setAccessTokenCookie } from './controllers/users'
import SpotifyModel from './models/Spotify'
import UserModel from './models/User'

const Spotify = new SpotifyModel()
const User = new UserModel()

export const spotifyAuthCheck = async (req, res, next) => {

    const user = req.signedCookies.user

    if (user && !req.signedCookies.access_token) {

        const refreshToken = await User.getRefreshToken(user.id)

        if (refreshToken) {
            console.log(`no access token but we have a refreshToken for user ${user.id}`)

            const authData = await Spotify.getAccessTokenFromRefreshToken(refreshToken, user.id)

            if (authData.access_token) {
                await setAccessTokenCookie(res, authData)
                return next()
            }

            console.error('Didnt receive access token')
        }

    }

    if (!user || !req.signedCookies.access_token) {
        console.log('No cookies to continue')

        // TODO add this to overall error handler in Vue
        res.status(403).json({ status: 'error', message: 'not authorized in Spotify' })
    }

    next()
}


