export const adminCheck = async (req, res, next) => {

    if (req.isAuthenticated() && req.user.is_admin) {
        console.log('user is admin and can continue')
        next()
    } else {
        console.log('No cookies to continue')

        // TODO add this to overall error handler in Vue
        res.status(403).json({ status: 'error', message: 'not authorized as admin' })
    }
}


