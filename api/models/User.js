import DB from '../db'

export default class User {
    constructor() {
        this.db = new DB()
    }

    async findUser(email) {
        return await this.db.single('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    }

    async registerUserThroughEmail(name, email, subscribeToMail) {
        const user = await db.query(
            'INSERT INTO users (name, email, mail_subscription) VALUES (?, ?, ?)',
            [name, email, subscribeToMail]
        )

        if (!user.insertId) {
            throw 'Could not register user'
        }
        return user
    }
}