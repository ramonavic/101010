import DB from '../db'

export default class User {
    constructor() {
        this.db = new DB()
    }

    async findUser(email) {
        return await this.db.single('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    }

    async registerUserThroughEmail(name, email, subscribeToMail) {
        const user = await this.db.query(
            `INSERT INTO users (name, email, mail_subscription) VALUES (?, ?, ?)`,
            [name, email, subscribeToMail]
        )

        if (!user.insertId) {
            throw 'Could not insert user in DB'
        }
        return user
    }

    async updateRefreshToken(id = null, token = null) {
        if (!id) {
            throw `Cant update refreshtoken in DB`
        }

        const update = await this.db.query(
            `UPDATE users 
                SET refresh_token = ?
            WHERE id = ?`,
            [id, token]
        )

        console.log(update)

    }

    async getRefreshToken(id = null) {
        if (!id) {
            throw `No user id passed while getting refresh token`
        }

        return this.db.single(`SELECT refresh_token FROM users WHERE id = ?`, [id])
    }

    async updateWithSpotifyInfo(userId, spotifyId, image) {

        return this.db.query(
            `UPDATE users 
            SET spotify_id = ?,
                image = ?
            WHERE id = ?`,
            [
                userId,
                spotifyId,
                image
            ]
        )
    }
}