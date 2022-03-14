import axios from 'axios'
import UserModel from './User'

const User = new UserModel()

export default class Spotify {
    constructor() {
        this.client_id = process.env.SPOTIFY_CLIENT_ID
        this.client_secret = process.env.SPOTIFY_CLIENT_SECRET
        this.redirect_uri = process.env.REDIRECT_URI
        this.scope = 'user-read-email user-read-private playlist-modify-public'
    }

    prepareLoginDetails() {
        return new URLSearchParams({
            client_id: this.client_id,
            redirect_uri: this.redirect_uri,
            scope: this.scope,
            response_type: 'code',
            show_dialog: true
        })
    }

    async getAccessToken(code, userId) {

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
            if (data) {
                if (data.refresh_token) {
                    User.updateRefreshToken(userId, data.refresh_token)
                }

                return {
                    ...data,
                    status: 'succesfully refresh token'
                }
            }

        } catch (err) {
            console.log(err)
            return {
                status: 'Something went wrong while retrieving access token'
            }
        }
    }

    async getAccessTokenFromRefreshToken(refresh_token, userId) {
        console.log('refresh token', refresh_token)
        const params = {
            grant_type: 'refresh_token',
            client_id: this.client_id,
            client_secret: this.client_secret,
            refresh_token: this.refresh_token
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
                const refreshToken = response.data.refresh_token
                if (data.refreshToken) {
                    User.updateRefreshToken(userId, data.refreshToken)
                }

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
}