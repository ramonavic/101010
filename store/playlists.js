import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const state = () => ({
    playlists: [],
    playlistNames: [],
    filteredPlaylistNames: []
})

export const mutations = {
    UPDATE_PLAYLISTS(state, payload) {
        state.playlists = payload
    },

    SET_FILTERED_PLAYLISTS(state, payload) {
        state.filteredPlaylistNames = payload
    }
    // toggleSubscription(state, payload) {
    //     // state.user = payload;
    // }
}

export const actions = {

    async fetchPlaylists({ commit }) {
        const playlists = await this.$axios.get('/api/playlists/index')
        console.log('fetched playlists', playlists.data)
        commit('UPDATE_PLAYLISTS', playlists.data)
    },

    // TODO make later
    async toggleSubscription({ commit }) {
        // await axios.post('/api/users/logout')
        // commit('mutateUser', null)
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
    }
}
