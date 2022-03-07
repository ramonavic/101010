import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const state = () => ({
    playlists: null
})

export const mutations = {
    updatePlaylists(state, payload) {
        state.playlists = payload
    }
    // toggleSubscription(state, payload) {
    //     // state.user = payload;
    // }
}

export const actions = {

    async fetchPlaylists({ commit }) {
        const playlists = await this.$axios.get('/api/playlists/index')
        console.log('fetched playlists', playlists.data)
        commit('updatePlaylists', playlists.data)
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
    }
}
