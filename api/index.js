import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Import routes
import users from './routes/users'
import playlists from './routes/playlists'
import admin from './routes/admin'

// Migrate to .env files
const cookieSecret = 'RhQ-5NtjNAphRzoEyJ-BmqKXATLFOMo8'

const app = express()
app.use(cookieParser(cookieSecret, { httpOnly: true }))
app.use(express.json())
app.use(cors())

module.exports = {
    path: '/api/',
    handler: app
}

app.use('*', (req, res, next) => {
    console.log('current path: ', req.url)
    next()
})

// Setup routes
app.use(users)
app.use(playlists)
app.use(admin)


