import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const state = () => ({
    player: null,
    playback: null,
    currentPlaylist: null,
    deviceId: null
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
    }
}

export const getters = {
    getAccessToken(state, getters, rootState, rootGetters) {
        console.log('getting access from rootgetter', rootGetters["user/getAccessToken"], rootGetters)
        return rootGetters["user/getAccessToken"]
    },

    getDeviceId(state) {
        return state.deviceId
    }
}

export const actions = {

    init({ getters, commit, dispatch }) {

        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: (cb) => {
                // TODO find way to re-add auth token when it's removed
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


    startPlaylist({ getters }, playlistUri) {

        this.$axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${getters['getDeviceId']}`,
            {
                context_uri: playlistUri,
                offset: {
                    position: 0,
                },
            },

            // TODO create axios config and add headers when we have the access token
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getters["getAccessToken"]}`,
                }
            })
    },

    addListeners({ commit }, player) {
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

            commit('UPDATE_PLAYBACK', state)
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
