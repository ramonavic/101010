import DB from '../db'

export default class Tags {
    constructor() {
        this.db = new DB()
    }

    async getAll() {
        return await this.db.query(`SELECT * FROM tags`)
    }

    async getTagsById(ids = []) {
        return await this.db.query(`SELECT * FROM tags WHERE id IN (?)`, [ids])
    }
}