import { describe, expect, it, beforeEach } from 'vitest'
import * as Playlists from '../../api/controllers/playlists'
import { playlists } from '../mocks/data/playlists'
import { tags } from '../mocks/data/tags'
import { tracks } from '../mocks/data/tracks'

let completePlaylists

describe('Attaching tags and tracks to a list of playlists', () => {
    beforeEach(() => {
        completePlaylists = Playlists.attachTagsAndTracks(playlists, tracks, tags)
    })

    it('Should attach tracks to the related playlist_id', () => {

        console.log(completePlaylists[0])

        // Playlist: Latin Cowboys should be first based on data file
        expect(completePlaylists[0].id).toBe(3)

        const firstPlaylistTracks = completePlaylists[0].tracks

        expect(
            Array.isArray(firstPlaylistTracks)
        ).toBeTruthy()

        expect(firstPlaylistTracks.length).toBe(8)

        // Check if track id 74 is added to the first playlist
        const firstPlaylistAddedTrack = firstPlaylistTracks.find(track => track.id === 74)
        expect(firstPlaylistAddedTrack.title).toBe(`Borracho la Embarré`)
        expect(firstPlaylistAddedTrack.artists).toBe(`Juan Carlos Hurtado`)
    })

    it(`Should not attach tracks if the playlist doesn't exist`, () => {

    })

    it('Should attach tags to the right playlist_id', () => {
        const completePlaylists = Playlists.attachTagsAndTracks(playlists, tracks, tags)

        expect(
            Array.isArray(completePlaylists[0].tags)
        ).toBeTruthy()


        // Check if the is_theme tag latino is first
        expect(completePlaylists[0].tags[0].name).toBe('latino')
        expect(completePlaylists[0].tags.length).toBe(3)
    })
})
