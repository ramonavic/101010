import passportCustom from 'passport-custom';
import jwt from 'jsonwebtoken'
import UserModel from '../models/User'
import passport from 'passport';

export const setupLoginStrategies = () => {
    const User = new UserModel()
    const CustomStrategy = passportCustom.Strategy;

    passport.use('magicLink', new CustomStrategy(
        async function (req, callback) {

            console.log('inside passport')

            const auth = req.headers.authorization
            if (!auth || !auth.startsWith('Bearer ')) {
                return callback({ status: 'error', message: `Bad auth request` }, null)

                // return res.status(403).json({ status: 'error', message: `Bad auth request` })
            }

            const token = auth.substring(7, auth.length)

            let decoded
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET)
            } catch (err) {
                console.log(`Can't verify JWT`, err)

                return callback({ status: 'error', message: `Can't verify JWT` }, null)
                // return res.status(403).json({ status: 'error', message: `Can't verify JWT`, error: err })
            }

            if (!decoded.hasOwnProperty('email') || !decoded.hasOwnProperty('expiration')) {
                return callback({ status: 'error', message: `JWT token invalid` }, null)

                // return res.status(403).json({ status: 'error', message: `JWT token invalid` })
            }

            const { email, expiration } = decoded

            const user = await User.findUser(email)

            // Verify JWT
            if (!user) {
                return callback({ status: 'error', message: `User doesn't exist` }, null)


                // return res.status(404).json({ status: 'error', message: `User doesn't exist` })

                // TODO might have to use callback
            }
            const expired = expiration > new Date()
            if (expired) {
                return callback({ status: 'error', message: `Token expired` }, null)


                // return res.status(404).json({ status: 'error', message: `Token expired` })
            }

            // User succesfully verified
            return callback(null, user)

        }
    ))

    passport.use('checkAuth', new CustomStrategy(
        async function (req, callback) {
            console.log('inside check auth')

            console.log('is authenticated?', req.isAuthenticated(), req.user)
            if (req.isAuthenticated()) {
                return callback(null, req.user)
            }

            // Check for remember me cookie
            const userCookie = req.signedCookies.user

            console.log('trying to auth with usercookie', userCookie)
            if (userCookie) {
                const user = await User.findUserById(userCookie.id)

                return callback(null, user)
            }
        }
    ))


    passport.serializeUser(function (user, done) {
        console.log('serializing user')

        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        console.log('desiarlized user')
        done(null, user);
    });


}



