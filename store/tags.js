import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export const state = () => ({
    tags: [],
    filteredTags: null,
    tagNames: []
})

export const mutations = {
    UPDATE_TAGS(state, payload) {
        state.tags = payload
    },

    ADD_TAGS(state, payload) {
        state.tags.push(...payload)
    },

    SET_FILTERED_TAGS(state, names) {
        state.filteredTags = names
    }
}

export const actions = {

    async fetchTags({ commit }) {
        const response = await this.$axios.get('/api/admin/fetch_tags')
        commit('UPDATE_TAGS', response.data.tags)
    },

    async addTagsToPlaylist({ commit, state }, payload) {

        const response = await this.$axios.post('/api/admin/add_tags_to_playlist', {
            data: payload
        })
        const newTags = response.data.newTags

        newTags && commit('ADD_TAGS', newTags)

        console.log('added tags to store', state.tags)
    }
}

export const getters = {
    getTags(state) {
        return state.tags
    },

    getTagNames(state) {
        return state.tags.map((tag) => tag.name)
    },

    getFilteredTagNames(state) {
        if (state.filteredTags) {
            return state.filteredTags
        }
        return state.tagNames
    }
}
