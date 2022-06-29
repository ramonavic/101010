<template>
  <div class="card">
            <div class="top"> 
                <span class="header"> TRACKLIST </span>

                <!-- TODO: highlight track that is played. For this we to create logic in the admin to add the spotify_id. 
                Then we should readd all the tracks again. -->
                <template v-for="track in tracks" >
                    <span class="track" :key="track.id" @click="$emit('onClickPlay', track.sequence)"> 
                        {{track.sequence}}. {{track.artists}} - {{track.title}}  
                    </span>
                </template>
            </div>
        </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        tracks: Array,
    },

    computed: {
        ...mapGetters({
            currentTrack: 'player/getCurrentTrack',
        }),
    },

    methods: {
        onClickPlay(sequence) {
            this.$parent.onClickPlay(sequence)
        },
    },
}
</script>

<style lang="scss" scoped>
.card {
    width: 30rem !important;
    height: 30rem;
    border: 1px solid $grey-dark;
    box-shadow: 1px 3px 3px 3px $black;
    background-color: $background;
    cursor: pointer;
    border-radius: 2px;
}

.top {
    position: relative;
    margin: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;

    .header {
        margin: 0.8rem;
    }

    .track {
        font-size: 0.8rem;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
        text-align: center;
        line-height: 2rem;
        cursor: pointer;
        transition: all 150ms ease;

        &:hover {
            color: $grey-light;
        }
    }
}
</style>