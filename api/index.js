import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'
import redis from './redis'
import redisStore from 'connect-redis'
import passport from 'passport'
import { setupLoginStrategies } from './auth/passport'

const RedisStore = new redisStore(session)
const Redis = new redis()

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

app.use(
    session({
        store: new RedisStore({ client: Redis.connection, session }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        cookie: {
            secure: false,  // if true only transmit cookie over https
            httpOnly: true, // if true prevent client side JS from reading the cookie
            maxAge: 1000 * 60 * 60 * 24 * 7, // session max age in milliseconds TODO can be changed? 
        }
    })
)

app.use(passport.initialize());
app.use(passport.session());
setupLoginStrategies()

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


