import Mailer from '../mailer'
import UserModel from '../models/User'
import SpotifyModel from '../models/Spotify'
import jwt from 'jsonwebtoken'
import encryption from '../encryption'

const mailer = new Mailer()
const User = new UserModel()
const Spotify = new SpotifyModel()

export const connectSpotify = (req, res) => {

    const loginDetails = Spotify.prepareLoginDetails()

    res.writeHead(302, {
        Location: 'https://accounts.spotify.com/authorize?' + loginDetails
    })

    res.send()
}

export const authCallback = async (req, res) => {

    const user = req.user

    // TODO Improve user cookie to act more as remember token
    setUserCookie(res, user)


    if (user.spotify_id && user.refresh_token) {
        console.log('user has refresh token', user.refresh_token)

        const accessToken = await Spotify.getAccessTokenFromRefreshToken(user.refresh_token, user.id)

        if (accessToken === false) {
            user.needsNewRefreshToken = true
            await User.updateRefreshtoken(user.id, null)
        }

        setAccessTokenCookie(res, accessToken)

    }

    res.json(user)

}

export const spotifyCallback = async (req, res) => {

    const user = req.signedCookies.user
    if (!user) {
        res.status(403).send({ status: 'error', message: `You are not authenticated. Please login again first before connecting Spotify.` })
    }

    const code = req.query.code;
    const data = await Spotify.getAccessToken(code, user.id)

    if (data.access_token) {

        const spotifyUser = await Spotify.getUserInfo(data.access_token)
        console.log('after get user info', spotifyUser)

        // TODO fix images by uploading it to a CDN, but not important
        // let image = spotifyUser.images[0]?.url
        // image = /(.*(.jpg|.png|.jpeg))\?/.exec(image)[1]

        const updatedUser = await User.updateWithSpotifyInfo(user.id, spotifyUser.id)

        if (!updatedUser) {
            console.log(`User not updated with Spotify info`)
        }

        user.spotify_id = spotifyUser.id
        // user.image = image

        setUserCookie(res, user)
        setAccessTokenCookie(res, data)
        res.redirect('/')
    }
}

export const logout = async (req, res) => {
    console.log('inside logout')

    req.session.destroy((err) => {
        if (err) {
            console.log('Problem while destroying session', err)
        }

        res
            .clearCookie('user')
            .clearCookie('access_token')
            .redirect('/')
    })

}

export const setAccessTokenCookie = async (res, { access_token, expires_in }) => {
    if (!access_token || !expires_in) {
        throw `Can't set access token due to missing variables ${access_token} or ${expires_in}`
    }

    res.cookie('access_token', access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + expires_in * 1000),
        secure: true,
        signed: true
    })

    console.log('set access token cookie')
}

export const setUserCookie = (res, user) => {
    if (!user?.id) {
        console.log(user)
        throw `Failed setting user cookie`
    }

    const expires = new Date()
    res.cookie('user', user, {
        httpOnly: true,
        expires: new Date(expires.setMonth(expires.getMonth() + 6)), // 6 months later
        secure: true,
        signed: true
    })

    console.log('set user cookie')

    return true
}

export const register = async (req, res) => {
    const { name, email, isSubscribed } = req.body.params

    const userExists = await User.findUser(encryption.hash(email))

    console.log(userExists)

    if (userExists) {
        sendMagicLoginLink(name, email)

        res.json({ status: 'error', message: 'User already exists' })
    } else {

        try {

            // TODO this is not the right way. Better is to send email first with all necessary 
            // info in the JWT. Then make a new account on the fly based on info. But for now not important enough. 
            await User.registerUserThroughEmail(name, email, isSubscribed)
        } catch (err) {
            console.log(err)
            return res.status(404).json(err)
        }

        const hasSent = await sendMagicSubscriberLink(name, email)

        if (hasSent) {
            res.json({ status: 'success', message: 'User registered. Magic link sent.' })
        }
    }
}

export const requestLogin = async (req, res) => {
    console.log('requesting login')
    const email = req.body.params.email

    const user = await User.findUser(encryption.hash(email))

    console.log('user exists?', user)

    if (user) {
        sendMagicLoginLink(user.name, email)
    }

    // Always send sucess even if user doesnt exist
    res.json({ status: 'success', message: 'Magic link sent.' })
}

export const sendMagicLoginLink = async (name, email) => {

    const link = await generateLoginLink(email)

    const body = `
    <p>Hi ${name}, </p><br/>
    <p>Here is <a href ="${link}"> your magic login link</a> </p>
    <br />
    <p> Cheers!</p>
    <br /><br />
    <p>101010</p>`

    const sent = await mailer.send(email, 'Magic login link', body)

    // TODO created else for when mail fails to send
    console.log(sent)

    return true
}

export const sendMagicSubscriberLink = async (name, email) => {

    const link = await generateLoginLink(email)

    const body = `
        <p>Hi ${name}, </p><br/>
        <p>Welcome to 101010!</p>
        <p>Here is <a href ="${link}"> your magic login link</a> </p>
        <br />
        <p> Cheers!</p>
        <br /><br />
        <p>101010</p>
    `

    // TODO created else for when mail fails to send
    const sent = await mailer.send(email, 'Welcome to 101010', body)

    console.log(sent)

    return true
}

export const generateLoginLink = async (email) => {

    // JWT expires in 1 hour
    const expiration = new Date()
    expiration.setHours(expiration.getHours() + 1)

    const link = `${process.env.HOST_NAME}/?login_jwt=${jwt.sign({ email, expiration }, process.env.JWT_SECRET)}`

    console.log('created magic link', link)

    return link

}