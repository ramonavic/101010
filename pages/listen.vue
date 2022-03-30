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
            accessToken: 'user/getAccessToken',
        }),
    },

    async created() {
        await this.$store.dispatch('playlists/fetchPlaylists')
    },

    beforeMount() {
        const script = document.createElement('script')
        script.src = 'https://sdk.scdn.co/spotify-player.js'
        script.async = true

        document.body.appendChild(script)

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: (cb) => {
                    cb(this.accessToken)
                },
                volume: 0.5,
            })

            // setPlayer(player)

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id)
            })

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id)
            })

            player.connect()
        }
    },
}
</script>
