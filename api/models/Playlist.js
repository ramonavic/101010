import DB from '../db'

export default class Playlist {
    constructor() {
        this.db = new DB()
    }

    /**
     * This function will return all the playlists that have not been deleted
     * @returns An array of objects.
     */
    async getAll() {
        return await this.db.query(
            `SELECT * FROM playlists WHERE deleted_at IS NULL`
        )
    }

    /**
     * Given a spotify id, check if the playlist exists in the database
     * 
     * @param spotifyId - The Spotify ID of the playlist to check for.
     * @returns A boolean value.
     */
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
        const tracks = params.tracks
        delete params.tracks

        const addedPlaylist = await this.db.query(
            `INSERT INTO playlists (name, image, description, spotify_id) VALUES (?, ?, ?, ?)`,
            Object.values(params)
        )

        if (addedPlaylist.insertId) {

            let addTracksToPlaylistQuery = `
                INSERT INTO playlist_tracks 
                    (playlist_id, sequence, title, artists, duration_ms) 
                VALUES `
            tracks.forEach(({ sequence, title, artists, duration_ms }, index) => {

                if (index + 1 === tracks.length) {

                    addTracksToPlaylistQuery = addTracksToPlaylistQuery.concat(
                        `(${addedPlaylist.insertId}, ${sequence}, "${title}", "${artists}", ${duration_ms}); `
                    )
                    return
                }

                addTracksToPlaylistQuery = addTracksToPlaylistQuery.concat(
                    `(${addedPlaylist.insertId}, ${sequence}, "${title}", "${artists}", ${duration_ms}), `
                )

            })

            await this.db.query(addTracksToPlaylistQuery)
        }

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