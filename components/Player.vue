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

    async created() {
        await this.$store.dispatch('playlists/fetchPlaylists')
    },

    beforeMount() {
        const script = document.createElement('script')
        script.src = 'https://sdk.scdn.co/spotify-player.js'
        script.async = true

        document.body.appendChild(script)

        window.onSpotifyWebPlaybackSDKReady = () => {
            this.player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: (cb) => {
                    // TODO find way to re-add auth token when it's removed
                    console.log('doing check auth from spotify player')
                    // const response = await this.$axios.get('/api/users/check_auth')

                    // if (response.data) {
                    //     this.accessToken = response.data.access_token
                    // }

                    cb(this.accessToken)
                },
                volume: 0.75,
            })

            this.addListeners()

            this.setupErrorHandlers()

            this.player.connect()
        }
    },

    methods: {
        preparePlay(playlistUri) {
            console.log('clicked play', playlistUri)
            this.play({
                playerInstance: this.player,
                playlistUri,
            })
        },

        play({
            playerInstance: {
                _options: { getOAuthToken },
            },
            playlistUri,
        }) {
            console.log('init play', playlistUri)
            // getOAuthToken((accessToken) => {
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    context_uri: playlistUri,
                    offset: {
                        position: 0,
                    },
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.accessToken}`,
                },
            })
            // })
        },

        setupErrorHandlers() {
            this.player.on('authentication_error', ({ message }) => {
                console.log('Failed to authenticate player', message)

                // TODO fetch new auth token and replay
            })

            // TODO create confirm window
            this.player.on('account_error', ({ message }) => {
                console.error('Failed to validate Spotify account. No premium account.', message)
            })
        },

        addListeners() {
            this.player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id)

                this.deviceId = device_id
            })

            this.player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id)

                this.deviceId = null
            })

            this.player.addListener('player_state_changed', (state) => {
                console.log(state)
            })
        },
    },
}
</script>
