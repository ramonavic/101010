import axios from 'axios'

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
            res.send('something went wrong').end()
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const index = async (req, res) => {
    // TODO make non static
    try {
        const response = await axios.get('https://api.spotify.com/v1/users/ramonavic/playlists', {
            headers: {
                'Authorization': 'Bearer ' + req.signedCookies.access_token,
                'Content-Type': 'application/json'
            }
        })

        if (response.data) {
            res.send(response.data)
        } else {
            console.log(response)
            res.send('something went wrong')
        }
    } catch (err) {
        console.log(err)
    }
}