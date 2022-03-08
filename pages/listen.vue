<template>
    <section class="container">
        <PlaylistCard 
            v-bind:key="playlist.id" 
            v-for="playlist in playlists" 
            :playlist="playlist"
            :playlists-amount="playlist.length"
        />
    </section>
</template>

<style lang="scss" scoped>
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            playlists: 'playlists/getPlaylists'
        })
    },

    async created() {
        this.$store.dispatch('playlists/fetchPlaylists')
    }
}
</script>