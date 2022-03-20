<template class="container">
    <section class="forms-container">   
        <form class="container box admin-form" v-on:submit.prevent="getPlaylistInfo">
        <b-field label="Rounded">
            <b-select placeholder="Select a Playlist" rounded>
                
                
                <option :v-for="playlist in playlists" :v-model="playlist.id">{{playlist.name}}</option>
            </b-select>
        </b-field>
        </form>
    </section>
</template>

<style lang="scss" scoped>
.admin-form {
    max-width: 30rem;
    margin: 1rem;
}

.forms-container {
    display: flex;
    flex-wrap: wrap;
    margin: 2rem;
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            tags: [],
            name: null,
            id: null, 
            image: null,
            description: null
        }
    },
    computed: {
        ...mapGetters({
            tags: 'tags/getTags'
        })
    },
    created() {
        this.$store.dispatch('tags/fetchTags')
    },
    methods: {

    }
}
</script>