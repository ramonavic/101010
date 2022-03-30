import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const state = () => ({
    user: null,
    accessToken: ''
})

export const mutations = {
    MUTATE_USER(state, payload) {
        state.user = payload;
    },

    SET_ACCESS_TOKEN(state, payload) {
        state.accessToken = payload
    }
}

export const actions = {
    async logout({ commit }) {
        await this.$axios.post('/api/users/logout')
        commit('MUTATE_USER', null)
    }
}

export const getters = {
    getUser(state) {
        return state.user
    },

    getAccessToken(state) {
        return state.accessToken
    },

    isNotLoggedIn(state) {
        return state.user === null
    }
}
