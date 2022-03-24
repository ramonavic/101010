import DB from '../db'

export default class Playlist {
    constructor() {
        this.db = new DB()
    }

    async getAll() {
        return await this.db.query('SELECT * FROM playlists')
    }

    async checkIfExists(spotifyId) {
        const playlistExists = await this.db.single(
            'SELECT EXISTS(SELECT 1 FROM playlists WHERE spotify_id = ? LIMIT 1)',
            [spotifyId]
        )

        // Exist query gives a bit weird result, where the key is the query being performed
        // Since there is always one single result we can cast the first value in the object
        return !!Object.values(playlistExists)[0]
    }

    async add(params = {}) {
        const addedPlaylist = await this.db.query(
            `INSERT INTO playlists (name, image, description, spotify_id) VALUES (?, ?, ?, ?)`,
            Object.values(params)
        )

        return addedPlaylist.insertId
    }

    async addTags(playlistId = 0, tagIds = []) {

        // Create query to add all tag ids to playlist
        let addTagsToPlaylistQuery = ''
        tagIds.forEach((tagId) => {
            addTagsToPlaylistQuery = addTagsToPlaylistQuery.concat(
                `REPLACE INTO playlists_tags (playlist_id, tag_id) VALUES (${playlistId}, ${tagId}); `
            )
        })
        return await this.db.query(addTagsToPlaylistQuery)
    }
}