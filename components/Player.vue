<template>
    <div class="player-container">
        <section class="player-container__inner"> 

            <section class="info"> 
                <div v-if="currentTrack">
                    <span> 
                        <b-icon
                            type="is-primary"
                            icon="music-note-outline"
                            size="is-small"
                        ></b-icon>
                       <!-- <marquee v-if="isSmallScreen" scrolldelay="250" class="info__text"> {{artistsDisplay}} - {{currentTrack.name}} </marquee> -->
                       <span class="info__text"> {{artistsDisplay}} - {{currentTrack.name}} </span>
                    </span>
                </div>

                <span v-if="currentPlaylist">
                    <b-icon
                        type="is-primary"
                        icon="playlist-music-outline"
                        size="is-small"
                    ></b-icon>
                    <span class="info__text"> {{ currentPlaylist.name }}</span>
                </span>
            </section>

            <Controls />
            <div class="volume"> 
                <b-icon
                    type="is-primary"
                    :icon="getVolumeIcon"
                    size="is-small"
                ></b-icon>
                <b-slider 
                    class="volume__slider" 
                    v-model="volume" 
                    @change="changeVolume"
                    size="is-small"
                    :tooltip=false
                > </b-slider>
            </div>
        </section>
        <b-slider :tooltip=false v-model="progress" @change="changePosition" size="is-small"> </b-slider>
    </div>
</template>

<style scoped lang="scss">
.player-container {
    position: fixed;
    bottom: 0;
    width: 100vw;
    background: $background;
    padding: 1rem 2rem;

    &__inner {
        display: flex;
        justify-content: space-between;
    }

    .info {
        flex: 1;
        display: flex;
        justify-content: center;
        flex-direction: column;

        &__text {
            overflow-x: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 1rem;

            // @media screen and (max-width: 500px) {
            //     justify-content: center;
            // }
        }
    }
}

.volume {
    display: flex;
    align-items: center;

    &__slider {
        margin-left: 5px;
        width: 50px;
    }
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
            isSmallScreen: false,
            volume: 75,
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
                return artists.map((artist) => artist.name).join(', ')
            }
        },
        getVolumeIcon() {
            if (this.volume === 0) {
                return 'volume-mute'
            }

            if (this.volume < 33) {
                return 'volume-low'
            }

            if (this.volume > 33) {
                return 'volume-high'
            }
        },
    },

    async beforeCreate() {
        try {
            await this.$store.dispatch('playlists/fetchPlaylists')
        } catch (err) {
            console.log(err)

            if (err.message === 'not authorized in Spotify') {
                // TODO dont render player. So this fetch must be done at a higher level
            }
        }
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

        changePosition(relPosition) {
            // if (relPosition !== this.)
            console.log('changed position', relPosition)

            const absPosition = (relPosition / 100) * this.playback.duration

            this.$store.dispatch('player/changeTrackPosition', absPosition)
        },

        changeVolume(volume) {
            this.$store.dispatch('player/changeVolume', volume / 100)
        },

        // onResize(event) {
        //     // TODO make measurements more precise
        //     this.isSmallScreen = event.target.innerWidth < 800
        // },
    },

    watch: {
        playback() {
            this.updateProgress()
        },
    },

    // created() {
    //     window.addEventListener('resize', this.onResize)
    //     window.dispatchEvent(new Event('resize'))
    // },

    // beforeDestroy() {
    //     window.removeEventListener('resize', this.onResize, true)
    // },
}
</script>
