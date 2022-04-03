import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const state = () => ({
    user: null,
    accessToken: ''
})

export const getters = {
    getUser(state) {
        return state.user
    },

    getAccessToken(state) {
        console.log('getting acess token from store', state.accessToken)
        return state.accessToken
    },

    isNotLoggedIn(state) {
        return state.user === null
    }
}

export const mutations = {
    MUTATE_USER(state, payload) {
        state.user = payload;
    },

    SET_ACCESS_TOKEN(state, payload) {
        state.accessToken = payload

        this.$axios.defaults.headers.common = {
            'Authorization': `Bearer ${payload}`,
            'Content-Type': 'application/json'
        }
        console.log(state)
    }
}

export const actions = {
    async logout({ commit }) {
        await this.$axios.post('/api/users/logout')
        commit('MUTATE_USER', null)
    }
}
