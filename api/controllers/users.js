import axios from 'axios'
import DB from '../db'
import Mailer from '../mailer'
import jwt from 'jsonwebtoken'
import UserModel from '../Models/User'

// TODO more queries to Model
const db = new DB()
const mailer = new Mailer()
const User = new UserModel()

// TODO do this for production
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI
const scope = 'user-read-email user-read-private playlist-modify-public'

export const checkAuth = (req, res) => {

    // TODO expand this further with modal that tells user to auth again when spotify auth is gone

    console.log('inside check auth')
    if (req.signedCookies.user) {
        console.log('still authenticated')
        res.json(req.signedCookies.user)
    } else {
        res.end()
    }
}

export const connectSpotify = (req, res) => {

    const loginDetails = prepareLoginDetails()

    res.writeHead(302, {
        Location: 'https://accounts.spotify.com/authorize?' + loginDetails
    })

    res.send()
}

export const jwtLogin = async (req, res) => {
    console.log('auth headers', req.headers)
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) {
        console.log('Bad auth request')
        return res.status(403).json({ status: 'error', message: `Bad auth request` })
    }

    const token = auth.substring(7, auth.length)
    let decoded

    try {
        console.log('decoding token')
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        console.log(`Can't verify JWT`, err)
        return res.status(403).json({ status: 'error', message: `Can't verify JWT`, error: err })
    }

    console.log('decoding succeeded')

    if (!decoded.hasOwnProperty('email') || !decoded.hasOwnProperty('expiration')) {
        return res.status(403).json({ status: 'error', message: `JWT token invalid` })
    }

    const { email, expiration } = decoded

    const user = await User.findUser(email)

    console.log('user found', user)
    if (!user) {
        return res.status(403).json({ status: 'error', message: `User doesn't exist` })
    }

    const expired = expiration > new Date()
    if (expired) {
        return res.status(403).json({ status: 'error', message: `Token expired` })
    }

    res.json(user)

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

export const register = async (req, res) => {
    const { name, email, subscribeToMail } = req.body.params

    const userExists = await db.single('SELECT * FROM users WHERE email = ? LIMIT 1', [email])

    console.log(userExists)

    if (userExists) {
        sendMagicLoginLink(name, email)

        res.json({ status: 'error', message: 'User already exists' })
    } else {
        const user = await db.query('INSERT INTO users (name, email, mail_subscription) VALUES (?, ?, ?)', [name, email, subscribeToMail])

        if (!user.insertId) {
            throw 'Could not insert user'
        }

        const hasSent = await sendMagicSubscriberLink(name, email)

        if (hasSent) {
            res.json({ status: 'success', message: 'User registered. Magic link sent.' })
        }
    }
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

export const sendMagicSubscriberLink = async (name, email) => {

    // JWT expires in 1 hour
    const expiration = new Date()
    expiration.setHours(expiration.getHours() + 1)

    const link = `${process.env.HOST_NAME}/?login_jwt=${jwt.sign({ email, expiration }, process.env.JWT_SECRET)}`

    console.log('created magic link', link)
    const body = `
        <p>Hi ${name}, </p><br/>
        <p>Welcome to 101010!</p>
        <p>Here is <a href ="${link}"> your magic login link</a> </p>
        <br />
        <p> Cheers!</p>
        <br /><br />
        <p>101010</p>
    `

    const sent = await mailer.send(email, 'Magic login link', body)

    console.log(sent)

    return true
}