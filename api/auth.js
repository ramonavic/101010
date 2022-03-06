import { getAccessTokenFromRefreshToken, setCookies } from './controllers/users'

export const spotifyAuth = async (req, res, next) => {
    if (!req.signedCookies.access_token && req.signedCookies.refresh_token) {
        console.log('no access token', req.signedCookies.refresh_token)
        const authData = await getAccessTokenFromRefreshToken(req.signedCookies.refresh_token)
        if (authData.access_token) {
            await setCookies(res, authData)
        } else {
            console.error('Didnt receive access token')
        }
    }

    next()
}