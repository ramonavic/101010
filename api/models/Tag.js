import DB from '../db'

export default class Tags {
    constructor() {
        this.db = new DB()
    }

    async getAll() {
        return await this.db.query(`SELECT * FROM tags`)
    }

    /**
     * This function returns all the tags that are attached to a playlist
     * 
     * @returns An array of objects with the following properties:
     *     id: The id of the tag
     *     name: The name of the tag
     *     playlist_id: The id of the playlist the tag is attached to
     *     is_theme: Whether or not the tag is a theme
     */
    async getAllAttachedToPlaylists() {
        return await this.db.query(
            `SELECT t.id, t.name, pt.playlist_id, t.is_theme 
                FROM playlists_tags pt 
            INNER JOIN tags t 
                ON pt.tag_id = t.id`
        )
    }

    async getTagsById(ids = []) {
        return await this.db.query(`SELECT * FROM tags WHERE id IN (?)`, [ids])
    }
}