import DB from '../db'

export default class User {
    constructor() {
        this.db = new DB()
    }

    // TODO dont return stuff such as refresh token and maybe other stuff as well
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

    /**
     * Update the refresh token in the database for the user with the given id
     * @param [id=null] - The id of the user you want to update.
     * @param [token=null] - The token that will be used to generate access token
     */
    async updateRefreshToken(id = null, token = null) {
        console.log('updating refresh token in mysql', id, token)
        if (!id) {
            throw `Cant update refreshtoken in DB`
        }

        const update = await this.db.query(
            `UPDATE users 
                SET refresh_token = ?
            WHERE id = ?`,
            [token, id]
        )

        if (update.affectedRows < 1) {
            throw `MySQL didnt update User with refresh_token`
        }
    }

    async getRefreshToken(id = null) {
        if (!id) {
            throw `No user id passed while getting refresh token`
        }

        const result = await this.db.single(`SELECT refresh_token FROM users WHERE id = ? LIMIT 1`, [id])
        return result.refresh_token
    }

    async updateWithSpotifyInfo(userId, spotifyId, image) {

        const update = this.db.query(
            `UPDATE users 
            SET spotify_id = ?,
                image = ?
            WHERE id = ?`,
            [
                spotifyId,
                image,
                userId
            ]
        )

        if (update.affectedRows < 1) {
            return false
        }

        return true
    }
}