<template>
  <div class="card" id="tracklist">
            <div class="top"> 
                <span class="header"> TRACKLIST </span>
                <template v-for="track in tracks" >
                    <span class="track" :key="track.id" @click="onClickPlay(track.sequence)"> 
                        {{track.sequence}}. {{track.artists}} - {{track.title}}  
                    </span>
                </template>
            </div>
        </div>
</template>

<script>
export default {
    props: {
        tracks: Array,
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
    box-shadow: 18px 18px 22px 5px $black;
    background-color: $background;
    cursor: pointer;
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