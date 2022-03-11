import DB from '../db'

export default class User {
    constructor() {
        this.db = new DB()
    }

    async findUser(email) {
        return await this.db.single('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    }
}