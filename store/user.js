import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios'

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
        await axios.post('/api/users/logout')
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

// export const modules = {
//     landing,
//     navigation
// }
