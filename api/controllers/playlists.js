import axios from 'axios'
import db from '../db'

const DB = new db()

export const index = async (req, res) => {

    // TODO add if consumer is subscribed to this playlist (from users_playlists table)
    const playlists = await DB.query('SELECT * FROM playlists')

    if (playlists.length) {
        res.json(playlists)
    } else {
        res.status(400).json({ status: 'error', type: 'No playlists found' })
    }
}