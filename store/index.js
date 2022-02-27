import landing from "../pages/index";
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default ({
    state() {
        return {
            user: null
        }
    },
    mutations: {
      mutateUser(state, payload) {
          state.user = payload;
      }
    },
    getters: {
        getUser(state) {
            return state.user
        }
    },
    modules: {
        landing
    },
});
