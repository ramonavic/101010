<template>
    <div class="controls">
        <b-icon
            class="icon--clickable"
            icon="skip-previous-circle-outline"
            size="is-medium"
            type="is-primary"
            @click.native="previous"
        >
        </b-icon>
        <b-icon
            class="icon--clickable"
            v-if="isPlaying"
            icon="pause-circle-outline"
            size="is-medium"
            type="is-primary"
            is-link
            @click.native="togglePlay"
        > 
        </b-icon>
            <b-icon
            v-else
            class="icon--clickable"
            icon="play-circle-outline"
            size="is-medium"
            type="is-primary"
            is-link
            @click.native="togglePlay"
        > 
        </b-icon>
        <b-icon 
            class="icon--clickable"
            icon="skip-next-circle-outline"
            size="is-medium"
            type="is-primary"
            @click.native="next"
        >
        </b-icon>        
    </div>
</template>

<style lang="scss" scoped>
.icon--clickable {
    margin: 0.3rem;
}

.controls {
    flex: 1;
}
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
