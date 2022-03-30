<template>
    <div class="page-container">
        <section class="container playlists-container">
            <PlaylistCard 
                v-bind:key="playlist.id" 
                v-for="playlist in playlists" 
                :playlist="playlist"
                :playlists-amount="playlist.length"
            />
        </section>
    </div>
</template>

<style lang="scss">
.page-container {
    display: flex;
    justify-content: center;
}
.playlists-container {
    display: flex;
    flex-wrap: wrap;
    margin: 2rem;
    background-color: $background;
    justify-content: flex-start;

    @media screen and (max-width: 780px) {
        justify-content: center;
    }
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            playlists: 'playlists/getPlaylists',
        }),
    },

    async created() {
        await this.$store.dispatch('playlists/fetchPlaylists')
    },
}
</script>
