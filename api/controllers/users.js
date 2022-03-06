import axios from 'axios'

// TODO do this for production
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI
const scope = 'user-read-email user-read-private playlist-modify-public'

export const checkAuth = (req, res) => {

    console.log('inside check auth')
    if (req.signedCookies.user) {
        console.log('still authenticated')
        res.json(req.signedCookies.user)
    } else {
        res.end()
    }
}

export const login = (req, res) => {

    const loginDetails = prepareLoginDetails()

    res.writeHead(302, {
        Location: 'https://accounts.spotify.com/authorize?' + loginDetails
    })

    res.send()
}

export const spotifyCallback = async (req, res) => {

    const code = req.query.code;

    const data = await getAccessToken(code)

    if (data.access_token) {
        await setCookies(res, data)
        res.redirect('/')
    }
}

export const logout = async (req, res) => {
    res
        .clearCookie('user')
        .clearCookie('access_token')
        .clearCookie('refresh_token')
        .redirect('/')
}

const prepareLoginDetails = () => {
    return new URLSearchParams({
        client_id,
        redirect_uri,
        scope,
        response_type: 'code',
        show_dialog: true
    })
}

const getAccessToken = async (code) => {

    const params = {
        grant_type: 'authorization_code',
        client_id,
        client_secret,
        code,
        redirect_uri
    }

    try {
        const response = await axios({
            url: 'https://accounts.spotify.com/api/token',
            method: 'post',
            params,
            postHeaders: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        const data = response.data
        if (data) {
            return {
                ...data,
                status: 'succesfully retrieved token and set cookies'
            }
        }

    } catch (err) {
        console.log(err)
        return {
            status: 'Something went wrong while retrieving access token'
        }
    }
}

export const getAccessTokenFromRefreshToken = async (refresh_token) => {
    console.log('refresh token', refresh_token)
    const params = {
        grant_type: 'refresh_token',
        client_id,
        client_secret,
        refresh_token
    }

    try {
        const response = await axios({
            url: 'https://accounts.spotify.com/api/token',
            method: 'post',
            params,
            postHeaders: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
            }
        })

        console.log('refresh token response', response.data)

        if (response.data) {
            return response.data
        } else {
            console.log(response)
            return {
                state: 'failed'
            }
        }
    } catch (err) {
        console.log(err)
    }
}

export const setCookies = async (res, data = {}) => {
    res.cookie('access_token', data.access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + data.expires_in * 1000),
        secure: true,
        signed: true
    })

    // TODO only do this when needed. Maybe transfer this to the middleware function
    const user = await getUserInfo(data.access_token)
    console.log('got user', user)
    res.cookie('user', user, {
        httpOnly: true,
        expires: new Date(Date.now() + 36000000), // + 600 minutes
        secure: true,
        signed: true
    })

    if (data.refresh_token) {
        console.log('setting refresh token', data)

        // TODO change this to be saved in a DB
        res.cookie('refresh_token', data.refresh_token, {
            httpOnly: true,
            expires: new Date(Date.now() + data.expires_in * 1000),
            secure: true,
            signed: true
        })
    }

    return user
}

const getUserInfo = async (accessToken) => {

    const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })

    if (response.data) {

        const data = response.data
        const user = {
            name: data.display_name,
            id: data.id,
            images: data.images,
            email: data.email,
            profileUrl: data.external_urls.spotify
        }

        return user
    }
}