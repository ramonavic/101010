<template>
    <div class="page-container">
        <div class="playlists-container">
            <PlaylistCard 
                v-bind:key="playlist.id" 
                v-for="playlist in playlists" 
                :playlist="playlist"
                :playlists-amount="playlist.length"
            />
        </div>
    </div>
</template>

<style lang="scss">
.page-container {
    // display: flex;
    // justify-content: center;
}
.playlists-container {
    display: flex;
    flex-wrap: wrap;
    margin: 2rem;
    background-color: $background;
    gap: 2rem;

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
