<template>
    <div class="card-image" :style="backgroundImage"  :class="{'hide-album-cover': hideAlbumCover}">
        <div class="top">
            <div class="name"> {{playlist.name}} </div>
        </div>
        <div class="play-btn" @click="$emit('onClickPlay')">
            <b-icon
                custom-size="mdi"
                icon="play"
            ></b-icon>               
        </div>
        <div class="tags-container">
            <b-taglist>
                <template v-for="tag in playlist.tags">
                    <b-tag v-if="tag.is_theme" :key="tag.id" type="is-primary">
                        {{tag.name}}
                    </b-tag>
                    <b-tag  v-else :key="tag.id" type="is-grey">
                        {{tag.name}}
                    </b-tag>
                </template>
            </b-taglist>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card-image {
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-position: top;
    background-size: cover;
    position: absolute;
    background-color: $background;
    top: 0;
    z-index: $z-card-image;
}

.play-btn {
    position: absolute;
    top: calc(50% - 21px); // 21px is half of the is-large icon size.
    display: flex;
    justify-content: center;
    width: 100%;
    color: $grey-darker;
    font-size: 80px;
    cursor: pointer;

    &:hover {
        transition: all 150ms ease;
        transform: scale(1.1);
    }
}

.top {
    position: relative;
    margin: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .name {
        padding: 0.5rem;
        border-radius: 0.4rem;
        background-color: $background;
    }
}

.playlist {
    padding: 0 1rem;
    background-color: #0a0a0a;
}

.tags-container {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        backgroundImage: Object,
    },
    data() {
        return {
            isPlaying: false,
            hideAlbumCover: false, // Animation that hides album cover
        }
    },
    computed: {
        // createdDate() {
        //     return new Date(this.playlist.created_at).toDateString()
        // },
        ...mapGetters({
            playlist: 'playlists/getPreview',
        }),
    },
    watch: {
        playlist() {
            if (!this.isAnimating) {
                this.isAnimating = true
            }

            setTimeout(() => {
                this.isAnimating = false
            }, 800)
        },
    },
    methods: {
        onClickPlay() {
            this.$emit('onClickPlay')
        },
    },
}
</script>

