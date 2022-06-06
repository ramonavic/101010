import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const state = () => ({
    player: null,
    playback: null,
    currentPlaylist: null, // hold the playlist URI and name
    deviceId: null,
    currentTrack: null,
    spotifyUser: 'ramonavic' // doesn't change for now
})

export const mutations = {
    UPDATE_DEVICE_ID(state, payload) {
        state.deviceId = payload
    },

    UPDATE_PLAYBACK(state, payload) {
        state.playback = payload
    },

    REGISTER_PLAYER(state, payload) {
        state.player = payload
    },

    UPDATE_CURRENT_TRACK(state, payload) {
        state.currentTrack = payload
    },

    SET_CURRENT_PLAYLIST(state, payload) {

        // The database doesn't hold the uri, therefore 
        // calculate it before adding it to the store. 
        if (!payload.uri) {

            if (payload.id) {
                return state.currentPlaylist = {
                    uri: `spotify:user:${state.spotifyUser}:playlist:${payload.spotify_id}`,
                    ...payload
                }
            }
        }

        state.currentPlaylist = payload
    }
}

export const getters = {
    getAccessToken(state, getters, rootState, rootGetters) {
        return rootGetters["user/getAccessToken"]
    },

    getDeviceId(state) {
        return state.deviceId
    },

    getCurrentTrack(state) {
        return state.currentTrack
    },

    getCurrentPlaylist(state) {
        return state.currentPlaylist
    },

    getPlayback(state) {
        return state.playback
    },

    getIsPlaying(state) {
        if (state.playback) {
            return state.playback.paused === false
        } else {

            // If no playback, it's not playing.
            return false
        }
    }
}

export const actions = {

    init({ getters, commit, dispatch, rootGetters }) {

        const player = new window.Spotify.Player({
            name: '101010 Spotify Player',
            getOAuthToken: (cb) => {

                // TODO find way to re-add auth token when it's removed. So far doesn't seem necessary?
                console.log('doing check auth from spotify player', getters['getAccessToken'])
                // const response = await this.$axios.get('/api/users/check_auth')

                // if (response.data) {
                //     this.accessToken = response.data.access_token
                // }

                cb(getters['getAccessToken'])
            },
            volume: 0.75,
        })

        dispatch('addListeners', player)

        dispatch('setupErrorHandlers', player)

        player.connect()

        commit('REGISTER_PLAYER', player)
    },


    startPlaylist({ getters }, { playlistUri, sequence }) {

        console.log('starting playlist on sequence', sequence)
        this.$axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${getters['getDeviceId']}`,
            {
                context_uri: playlistUri,
                offset: {
                    // Spotify uses indexes, we start counting from 1
                    position: sequence - 1 || 0,
                },
            }
        )
    },

    togglePlay({ state, dispatch }, currentPlaylistUri) {

        // If we already have a current track, resume or pause.
        if (state.currentTrack) {
            return state.player.togglePlay()
        }

        // Otherwise there should only be a playlist loaded. 
        // This should always be the initial latest playlist
        dispatch('startPlaylist', currentPlaylistUri)

    },

    nextTrack({ state }) {
        state.player.nextTrack()
    },

    previousTrack({ state }) {
        state.player.previousTrack()
    },

    changeTrackPosition({ state }, position) {
        if (state.currentTrack) {
            state.player.seek(position)
        }
    },

    changeVolume({ state }, volume) {
        state.player.setVolume(volume)
    },

    updatePlayback({ commit, getters }, playbackState) {
        const currentTrackData = playbackState?.track_window?.current_track

        if (!currentTrackData) {
            console.log('no currentTrackData in update playback. Music has stopped', playbackState)
            return
        }

        // Check through getters if there is a current track and if it's different 
        // from the current track data
        if (currentTrackData?.id !== getters['getCurrentTrack']?.id) {
            const { id, name, artists, uri } = currentTrackData

            const currentTrack = {
                id,
                name,
                artists,
                uri
            }

            commit('UPDATE_CURRENT_TRACK', currentTrack)

        }

        if (playbackState.context.uri !== getters['getCurrentPlaylist'].uri) {

            commit(
                'SET_CURRENT_PLAYLIST',
                {
                    uri: playbackState.context.uri,
                    name: playbackState.context.metadata.name
                }
            )
        }

        const { duration, paused, loading, position, shuffle } = playbackState

        commit('UPDATE_PLAYBACK', {
            duration,
            paused,
            loading,
            position,
            shuffle
        })

    },

    addListeners({ commit, dispatch }, player) {
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id)

            commit('UPDATE_DEVICE_ID', device_id)
        })

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id)

            commit('UPDATE_DEVICE_ID', null)
        })

        player.addListener('player_state_changed', (state) => {
            console.log(state)

            dispatch('updatePlayback', state)
        })
    },

    setupErrorHandlers({ }, player) {
        player.on('authentication_error', ({ message }) => {
            console.log('Failed to authenticate player', message)

            // TODO fetch new auth token and replay
        })

        // TODO create confirm window. Need watcher inside component for this. 
        player.on('account_error', ({ message }) => {
            console.error('Failed to validate Spotify account. No premium account.', message)
        })
    },

}
