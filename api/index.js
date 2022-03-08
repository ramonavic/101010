import express from 'express'
import cookieParser from 'cookie-parser'
import users from './routes/users'
import playlists from './routes/playlists'

// Migrate to .env files
const cookieSecret = 'RhQ-5NtjNAphRzoEyJ-BmqKXATLFOMo8'

const app = express()
app.use(cookieParser(cookieSecret, { httpOnly: true }))
app.use(express.json())

module.exports = {
    path: '/api/',
    handler: app
}

// Setup routes
app.use(users)
app.use(playlists)

app.use('*', (req, res, next) => {
    console.log('current path: ', req.url)
    next()
})

