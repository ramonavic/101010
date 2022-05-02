import axios from 'axios'
import db from '../db'
import TagModel from '../models/Tag'
import PlaylistModel from '../models/Playlist'

const Tag = new TagModel()
const Playlist = new PlaylistModel()

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
            res.send(response.data)
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

    const exists = await Playlist.checkIfExists(params.spotify_id)

    if (exists) {
        res.status(400).json({ status: 'error', type: 'Playlist exists' })
    } else {

        const playlistId = await Playlist.add(params)

        console.log('Successfully added playlist: ', playlistId)
        res.json({ status: 'success', playlistId })
    }
}

export const getTags = async (req, res) => {
    const tags = await Tag.getAll()

    res.json({ tags })
}

export const addTagsToPlaylist = async (req, res) => {
    const { playlistId, tagsForPlaylist } = req.body.data

    // Keep an array of all the tag ids that should be added to the playlist
    const tagIdsForPlaylist = []

    // Create array of new tag ids
    // We will use this later to return our new tags to the client
    const newTagIds = []

    // Prepare query to insert tags in batch
    let newTagsQuery = ''
    tagsForPlaylist.forEach((tag) => {
        if (tag.isNew) {
            newTagsQuery = newTagsQuery.concat(`INSERT INTO tags (name) VALUES ('${tag.chosenTagName}'); `)
            return
        }

        if (tag.id) {
            tagIdsForPlaylist.push(tag.id)
        }
    })

    // Create total list of tag ids to add to playlist
    if (newTagsQuery) {

        const newTagsInDB = await DB.query(newTagsQuery)

        // When we have multiple new tags, we will receive an array from the batch query
        if (Object.prototype.toString.call(newTagsInDB) === '[object Array]') {

            newTagsInDB.forEach((tag) => {

                tagIdsForPlaylist.push(tag.insertId)
                newTagIds.push(tag.insertId)

            })

            // When only one tag is added, we receice an object
        } else {
            tagIdsForPlaylist.push(newTagsInDB.insertId)
            newTagIds.push(newTagsInDB.insertId)
        }
    }


    await Playlist.addTags(playlistId, tagIdsForPlaylist)

    const tagObjects = newTagIds?.length && await Tag.getTagsById(newTagIds) || []

    const responseObject = {
        status: 'success',
        newTags: tagObjects
    }

    res.json(responseObject)
}