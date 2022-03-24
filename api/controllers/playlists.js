import axios from 'axios'
import db from '../db'
import PlaylistModel from '../models/Playlist'

const Playlist = new PlaylistModel

const DB = new db()

export const index = async (req, res) => {

    // TODO add if consumer is subscribed to this playlist (from users_playlists table)
    const playlists = await Playlist.getAll()

    if (playlists.length) {
        res.json(playlists)
    } else {
        res.status(400).json({ status: 'error', type: 'No playlists found' })
    }
}