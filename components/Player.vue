<template>
    <section class="container">
        <Controls />
            <div v-if="currentTrack">
                <span> Now playing: {{artistsDisplay}} {{currentTrack.name}} </span>
            </div>

            <span v-if="currentPlaylist">
                <b-icon
                    type="is-primary"
                    icon="playlist-music-outline"
                    size="medium"
                ></b-icon>
                {{ currentPlaylist.name }}
            </span>
        <b-slider v-model="progress"> </b-slider>
      
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
            progress: 0,
            user: 'ramonavic',
            progressInterval: null,
        }
    },
    computed: {
        ...mapGetters({
            playback: 'player/getPlayback',
            currentTrack: 'player/getCurrentTrack',
            currentPlaylist: 'player/getCurrentPlaylist',
        }),
        artistsDisplay() {
            const artists = this.currentTrack?.artists
            if (artists) {
                return artists.map((artist) => artist.name).join(',')
            }
        },
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
            this.$store.dispatch('player/startPlaylist', playlistUri)
        },

        updateProgress() {
            clearInterval(this.progressInterval)

            // If update progress is called because of a Spotify event,
            // reset the calculated position to this.
            this.calculatedPosition = this.playback.position

            this.progress = (this.playback.position / this.playback.duration) * 100

            if (!this.playback.paused) {
                // Add another second ourselves, since Spotify only sends this data
                // when there are new events (such as play, pause).
                this.progressInterval = setInterval(() => {
                    if (this.playback && this.calculatedPosition + 1000 <= this.playback.duration) {
                        this.calculatedPosition = this.calculatedPosition + 1000

                        this.progress = (this.calculatedPosition / this.playback.duration) * 100
                    }
                }, 1000)
            }
        },
    },

    watch: {
        playback() {
            this.updateProgress()
        },
    },
}
</script>
