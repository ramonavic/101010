import db from '../db'
import PlaylistModel from '../models/Playlist'
import TagModel from '../models/Tag'

const Playlist = new PlaylistModel()
const Tag = new TagModel()

const DB = new db()

/**
 * Get all playlists and their tags
 * 
 * @param req - the request object
 * @param res - the response object
 */
export const index = async (req, res) => {

    // TODO add if consumer is subscribed to this playlist (from users_playlists table)
    let playlists = await Playlist.getAll()

    const tags = await Tag.getAllAttachedToPlaylists()

    const tracks = await Playlist.getAllTracks()

    // Attach tag array to playlist objects
    playlists.forEach((playlist, index) => {

        playlists[index].tracks = tracks.filter((track) => track.playlist_id === playlist.id)

        // Add tags to playlists and sort is_theme tags first (boolean sort)
        playlists[index].tags = tags.filter((tag) => {
            if (tag.playlist_id === playlist.id) {
                return tag
            }
        }).sort((a, b) => a.is_theme - b.is_theme).reverse()
    })

    if (!playlists.length) {
        return res.status(400).json({ status: 'error', type: 'No playlists found' })
    }

    const data = {
        playlists,
        accessToken: req.signedCookies.access_token
    }

    res.json(data)

}