import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const state = () => ({
    user: null
})

export const mutations = {
    mutateUser(state, payload) {
        state.user = payload;
    }
}

export const actions = {
    async logout({ commit }) {
        await this.$axios.post('/api/users/logout')
        commit('mutateUser', null)
    }
}

export const getters = {
    getUser(state) {
        return state.user
    },

    isNotLoggedIn(state) {
        return state.user === null
    }
}
