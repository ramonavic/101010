<template>
    <section class="player-container">
        <b-button v-on:click="preparePlay"> Play</b-button>
    </section>
</template>

<style scoped lang="scss">
.player-container {
    position: sticky;
    bottom: 0;
    width: 100vw;
    background: $background;
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            deviceId: null,
            player: {},
            user: 'ramonavic',
            currentTrack: null,
            currentPlaylist: null,
        }
    },
    computed: {
        ...mapGetters({
            playlists: 'playlists/getPlaylists',
            accessToken: 'user/getAccessToken',
        }),
    },

    async beforeCreate() {
        await this.$store.dispatch('playlists/fetchPlaylists')
    },

    mounted() {
        const script = document.createElement('script')
        script.src = 'https://sdk.scdn.co/spotify-player.js'
        script.async = true

        document.body.appendChild(script)

        window.onSpotifyWebPlaybackSDKReady = () => {
            this.$store.dispatch('player/init')
        }
    },

    methods: {
        preparePlay(playlistUri) {
            console.log('clicked play', playlistUri)

            this.$store.dispatch('player/startPlaylist', playlistUri)
        },
    },
}
</script>
