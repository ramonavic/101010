import axios from 'axios'
import db from '../db'

const DB = new db()


export const getPlaylist = async (req, res) => {
    console.log('inside get playlist', req.params.id)
    const playlistId = req.params.id

    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: {
                'Authorization': 'Bearer ' + req.signedCookies.access_token,
                'Content-Type': 'application/json'
            }
        })

        if (response.data) {
            res.send(response.data).end()
        } else {
            console.log(response)
            res.send('something went wrong')
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const addPlaylist = async (req, res) => {
    const params = req.body.params

    console.log('params to be added', params)

    const playlistExists = await DB.single(
        'SELECT EXISTS(SELECT 1 FROM playlists WHERE spotify_id = ? LIMIT 1)',
        [params.spotify_id]
    )

    // Exist query gives a bit weird result, where the key is the query being performed
    // Since there is always one single result we can cast the first value in the object
    const result = !!Object.values(playlistExists)[0]
    if (result) {
        res.status(400).json({ status: 'error', type: 'Playlist exists' })
    } else {
        console.log('adding playlist')
        const addedPlaylist = await DB.query(
            `INSERT INTO playlists (name, image, description, spotify_id) VALUES (?, ?, ?, ?)`,
            Object.values(params)
        )

        console.log(addedPlaylist)

        console.log('Successfully added playlist: ', addedPlaylist.insertId)
        res.json({ status: 'success', playlistId: addedPlaylist.insertId })
    }
}

export const getTags = async (req, res) => {
    const tags = DB.query(`SELECT * FROM tags`);

    console.log(tags)
}