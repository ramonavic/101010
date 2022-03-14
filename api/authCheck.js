import { setCookies } from './controllers/users'
import SpotifyModel from './models/Spotify'

const Spotify = new SpotifyModel()

export const spotifyAuthCheck = async (req, res, next) => {

    const user = req.signedCookies.user

    if (user && !req.signedCookies.access_token) {

        const refreshToken = User.getRefreshToken(user.id)

        console.log(refreshToken)

        if (refreshToken) {
            console.log(`no access token but we have a refreshToken for user ${user.id}`, refreshToken)

            const authData = await Spotify.getAccessTokenFromRefreshToken(refreshToken, user.id)
            if (authData.access_token) {
                await setCookies(res, authData)
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


