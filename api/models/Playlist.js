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
            `SELECT * FROM playlists WHERE deleted_at IS NULL ORDER BY created_at DESC`
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

    async getIdBySpotifyId(spotifyId) {
        const result = await this.db.single(`SELECT id FROM playlists WHERE spotify_id = ?`, [spotifyId])
        console.log(result)
        return result.id
    }

    async add(params = {}) {
        const tracks = params.tracks
        delete params.tracks

        // When the playlist already exists through the spotify_id, we only update the tracks
        const addedPlaylist = await this.db.query(
            `INSERT IGNORE INTO playlists (name, image, description, spotify_id) VALUES (?, ?, ?, ?)`,
            Object.values(params)
        )

        console.log(addedPlaylist)

        let playlistId = addedPlaylist.insertId

        if (!playlistId) {
            playlistId = await this.getIdBySpotifyId(params.spotify_id)
        }

        console.log(playlistId)

        let addTracksToPlaylistQuery = `
                INSERT INTO playlist_tracks 
                    (playlist_id, sequence, title, artists, duration_ms) 
                VALUES `
        tracks.forEach(({ sequence, title, artists, duration_ms }, index) => {

            if (index + 1 === tracks.length) {

                addTracksToPlaylistQuery = addTracksToPlaylistQuery.concat(
                    `(${playlistId}, ${sequence}, "${title}", "${artists}", ${duration_ms}); `
                )
                return
            }

            addTracksToPlaylistQuery = addTracksToPlaylistQuery.concat(
                `(${playlistId}, ${sequence}, "${title}", "${artists}", ${duration_ms}), `
            )

        })

        await this.db.query(addTracksToPlaylistQuery)

        return playlistId
    }

    async addTags(playlistId = 0, tagIds = []) {

        // Create query to add all tag ids to playlist
        let addTagsToPlaylistQuery = ''
        tagIds.forEach((tagId) => {
            addTagsToPlaylistQuery = addTagsToPlaylistQuery.concat(
                `REPLACE INTO playlists_tags (playlist_id, tag_id) VALUES (${playlistId}, ${tagId}); `
            )
        })
        console.log(addTagsToPlaylistQuery)
        return await this.db.query(addTagsToPlaylistQuery)
    }

    async getAllTracks() {
        return this.db.query(`SELECT * FROM playlist_tracks`)
    }
}