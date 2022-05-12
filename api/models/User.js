import DB from '../db'

export default class User {
    constructor() {
        this.db = new DB()
    }

    /**
     * Find a user by email address
     * @param email - The email of the user to find.
     * @returns A user object
     */
    async findUser(email) {
        const user = await this.db.single(
            `SELECT id, name, email, spotify_id, image, mail_subscription, is_admin 
                FROM users 
            WHERE email = ? 
                AND deleted_at IS NULL 
            LIMIT 1`,
            [email]
        )

        console.log('db user', user)

        return user
    }

    /**
     * Find a user by id, but only if they are not deleted
     * @param id - The id of the user to find.
     * @returns The user object
     */
    async findUserById(id) {
        return await this.db.single(
            `SELECT id, name, email, spotify_id, image, mail_subscription, is_admin 
                FROM users 
            WHERE id = ? 
                AND deleted_at IS NULL 
            LIMIT 1`,
            [id]
        )
    }

    /**
     * It inserts a new user into the database.
     * @param name - The name of the user.
     * @param email - The email of the user.
     * @param subscribeToMail - a boolean value that indicates whether the user wants to receive emails
     * or not.
     * @returns The query result.
     */
    async registerUserThroughEmail(name, email, isSubscribed) {
        const result = await this.db.query(
            `INSERT INTO users (name, email, mail_subscription) VALUES (?, ?, ?)`,
            [name, email, isSubscribed]
        )

        if (!result.insertId) {
            throw 'Could not insert user in DB'
        }
        return result
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

    /**
     * Get the refresh token for a user
     * @param [id=null] - The id of the user.
     * @returns The refresh token.
     */
    async getRefreshToken(id = null) {
        if (!id) {
            throw `No user id passed while getting refresh token`
        }

        const result = await this.db.single(`SELECT refresh_token FROM users WHERE id = ? LIMIT 1`, [id])
        return result.refresh_token
    }

    /**
     * This function updates the user's spotify id and image in the database
     * @param userId - The id of the user that we want to update.
     * @param spotifyId - The spotify id of the user.
     * @param image - The image URL of the user's profile.
     * @returns A boolean value.
     */
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