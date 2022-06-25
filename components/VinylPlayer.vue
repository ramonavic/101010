<template>
    <section>

                <!-- <div class="top">
                    <div class="title over-image"> {{playlist.name}} </div>
                </div>         -->
        <div class="needle" :class="{'is-playing': isPlaying}"></div>
        <div class="middle"></div>
        <!-- <div class="card-footer"> -->

            <!-- TODO hier moet een Spotify icoon komen -->
            <!-- <a href="#" @click="$emit('onClickPlay')" class="card-footer-item">Play</a> -->

            <!-- <a href="#" class="card-footer-item">Open in Spotify</a> -->
            <!-- TODO hier moet een hartje icoon komen -->
            <!-- <a href="#" class="card-footer-item">Add Playlist</a> -->
        <!-- </div> -->
    </section>
</template>

<style scoped lang="scss">
.needle {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: rotate(0deg);
    border: 0.1px solid $grey;
    width: 1rem;
    height: 12rem;
    z-index: 200;
    background: #0a0a0a;
    border-bottom: 0;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;

    &.is-playing {
        animation-name: playing;
        animation-duration: 2000ms;
        animation-iteration-count: 1;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
    }

    @keyframes playing {
        from {
            right: 0;
            bottom: 0;
            transform: rotate(0deg);
        }
        to {
            height: 12rem;
            transform: rotate(-40deg);
            right: 3.7rem;
            bottom: -1rem;
        }
    }
}

.middle {
    position: absolute;
    top: 50%;
    left: 50%;
    background: $grey;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    z-index: 1000;
}
</style>

<script>
export default {
    props: {
        isPlaying: Boolean,
    },
}
</script>

