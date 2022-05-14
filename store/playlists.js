import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const state = () => ({
    playlists: [],
    playlistNames: [],
    filteredPlaylistNames: [],
    preview: [],
    listenState: 'browse' // either browse or vinyl
})

export const mutations = {
    UPDATE_PLAYLISTS(state, payload) {
        state.playlists = payload
    },

    SET_FILTERED_PLAYLISTS(state, payload) {
        state.filteredPlaylistNames = payload
    },

    SET_PREVIEW(state, payload) {

        // Helps with performance because this is done onHover
        if (state.preview.id != payload.id) {
            state.preview = payload
        }

    }
    // toggleSubscription(state, payload) {
    //     // state.user = payload;
    // }
}

export const actions = {

    async fetchPlaylists({ commit }) {
        const response = await this.$axios.get('/api/playlists/index')

        commit('UPDATE_PLAYLISTS', response.data.playlists)

        // TODO Determine if this can better be done in a more generic place 
        // f.e. when we update the access token through refresh token
        await commit('user/SET_ACCESS_TOKEN', response.data.accessToken, { root: true })

        commit('player/SET_CURRENT_PLAYLIST', response.data.playlists[0], { root: true })

        commit('SET_PREVIEW', response.data.playlists[0])
    },

    // TODO make later
    async toggleSubscription({ commit }) {

    }
}

export const getters = {
    getPlaylists(state) {
        return state.playlists
    },

    getPlaylistNames(state) {
        return state.playlists.map(playlist => playlist.name)
    },

    getFilteredPlaylistNames(state) {
        if (state.filteredPlaylistNames) {
            return state.filteredPlaylistNames
        }
        return state.playlistNames
    },

    getPreview(state) {
        return state.preview
    }
}
