<template>
    <section class="player-container">

     <!-- TODO wanneer playback paused op false is, verander naar pause teken -->
            <div class="controls">
                <b-icon
                    v-if="isPlaying"
                    icon="pause-circle-outline"
                    size="medium"
                    type="is-primary"
                    is-link
                    @click.native="togglePlay"
                > 
                </b-icon>
                 <b-icon
                    v-else
                    icon="play-circle-outline"
                    size="medium"
                    type="is-primary"
                    is-link
                    @click.native="togglePlay"
                > 
                </b-icon>
                <b-icon
                    icon="skip-previous-circle-outline"
                    size="medium"
                    type="is-primary"
                    @click.native="previous"
                >
                </b-icon>
                <b-icon 
                    icon="skip-next-circle-outline"
                    size="medium"
                    type="is-primary"
                    @click.native="next"
                >
                </b-icon>        
            </div>
    </section>
</template>

<style lang="scss" scoped>
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            isPlaying: 'player/getIsPlaying',
            currentPlaylist: 'player/getCurrentPlaylist',
        }),
    },
    methods: {
        togglePlay() {
            const currentPlaylistUri = this.currentPlaylist?.uri

            this.$store.dispatch('player/togglePlay', currentPlaylistUri)
        },

        previous() {
            this.$store.dispatch('player/previousTrack')
        },

        next() {
            this.$store.dispatch('player/nextTrack')
        },
    },
}
</script>
