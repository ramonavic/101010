import axios from 'axios'
import UserModel from './User'

const User = new UserModel()

export default class Spotify {
    constructor() {
        this.client_id = process.env.SPOTIFY_CLIENT_ID
        this.client_secret = process.env.SPOTIFY_CLIENT_SECRET
        this.redirect_uri = process.env.REDIRECT_URI
        this.scope = 'user-read-email user-read-private playlist-modify-public streaming'
    }

    prepareLoginDetails() {
        return new URLSearchParams({
            client_id: this.client_id,
            redirect_uri: this.redirect_uri,
            scope: this.scope,
            response_type: 'code',
            show_dialog: true,

            // TODO need to make sure we check if the state is correct when we return
            state: this.generateRandomString(16) // Create a state to help check for request forgery
        })
    }

    async getAccessToken(code, userId) {
        if (!code || !userId) {
            throw `Invalid params supplied to get access token`
        }

        const params = {
            grant_type: 'authorization_code',
            client_id: this.client_id,
            client_secret: this.client_secret,
            code,
            redirect_uri: this.redirect_uri
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
            console.log('data from access token', data)
            // Check for request forgery
            if (data) {
                data.refresh_token && await User.updateRefreshToken(userId, data.refresh_token)

                return {
                    ...data,
                    status: 'succesfully refresh token'
                }
            } else {
                console.error('No refresh token received')
            }

        } catch (err) {
            console.log(err)
            return {
                status: 'Something went wrong while retrieving access token'
            }
        }
    }

    async getAccessTokenFromRefreshToken(refresh_token, userId) {

        this.state = this.generateRandomString(16)

        const params = {
            grant_type: 'refresh_token',
            client_id: this.client_id,
            client_secret: this.client_secret,
            refresh_token
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

            console.log('got data from accestoken', response.data)

            if (response.data.access_token) {

                // Spotify will sometimes return a new refresh token
                const refreshToken = response.data.refresh_token
                if (refreshToken) {
                    User.updateRefreshToken(userId, refreshToken)
                }

                return response.data
            } else {
                console.log('didnt receive token through refresn token')
                return {
                    state: 'failed'
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    async getUserInfo(accessToken) {

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

    generateRandomString(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
}