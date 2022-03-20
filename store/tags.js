import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const state = () => ({
    tags: null
})

export const mutations = {
    updateTags(state, payload) {
        state.tags = payload
    }
}

export const actions = {

    async fetchTags({ commit }) {
        const tags = await this.$axios.get('/api/admin/fetch_tags')
        console.log('fetched tags', tags.data)
        commit('updateTags', tags.data)
    },

    async addTags({ commit, state }) {
        console.log('adding tags', state)
    }
}

export const getters = {
    getTags(state) {
        return state.tags
    }
}
