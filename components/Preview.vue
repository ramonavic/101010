<template>
    <section>
            <div 
                class="card" 
            >  
                <Container 
                    :group-name="dropName"
                    @drag-start="onDrag"
                    @drag-end="onDragEnd"
                >            
                <Draggable>
                    <Vinyl :isAnimating="isAnimating" :backgroundImage="backgroundImage" :isPreview="true"/>
                </Draggable>
                </Container>
                <div class="card-image" :style="backgroundImage"  :class="{'hide-album-cover': hideAlbumCover}">
                    <div class="top">
                        <div class="name"> {{playlist.name}} </div>
                    </div>
                    <div class="play-btn" @click="onClickPlay()">
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
            </div>
        <Tracklist :tracks="playlist.tracks" />
    </section>
</template>

<style scoped lang="scss">
section {
    display: flex;
    gap: 5rem; // TODO moet mobile beter worden
}

.card {
    width: 30rem !important;
    height: 30rem;
    border: 1px solid $grey-dark;
    box-shadow: 18px 18px 22px 5px $black;
    background-color: $background;
    cursor: pointer;

    &:hover {
        .vinyl {
            transition: all 150ms ease;
            left: 33%;
        }
    }

    @keyframes hide {
        from {
            transform: translate(0);
        }
        to {
            transform: translateX(-100vw);
        }
    }

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

        &.hide-album-cover {
            animation-name: hide;
            animation-duration: 800ms;
            animation-iteration-count: 1;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
        }
    }

    .play-btn {
        position: absolute;
        top: calc(50% - 21px); // 21px is half of the is-large icon size.
        display: flex;
        justify-content: center;
        width: 100%;
        color: $grey-darker;
        font-size: 80px;

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
        overflow-y: scroll;

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
}
</style>

<script>
import { mapGetters } from 'vuex'
import { Container, Draggable } from 'vue-smooth-dnd'

export default {
    components: {
        Container,
        Draggable,
    },
    data() {
        return {
            spotifyUser: 'ramonavic',
            isPlaying: false,
            isAnimating: false, // Animates vinyl when someone hovers of a playlist in the sidebar
            dropName: 'vinyl', // This creates a drag and drop group
            hideAlbumCover: false, // Animation that hides album cover
        }
    },
    computed: {
        createdDate() {
            return new Date(this.playlist.created_at).toDateString()
        },
        backgroundImage() {
            return {
                'background-image': `url(${this.playlist.image})`,
            }
        },
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
        onClickPlay(sequence) {
            // Find the player component thats attached to default.vue
            const rootPage = this.$root.$children.find((child) => {
                // Look for property isRoot
                return child.isRoot
            })

            const player = rootPage?.$refs?.player

            if (player) {
                player.preparePlay(this.getPlaylistUri(), sequence)

                this.isPlaying = true
            } else {
                // TODO throw through confirm
            }
        },
        getPlaylistUri() {
            return `spotify:user:${this.spotifyUser}:playlist:${this.playlist.spotify_id}`
        },

        onDrag() {
            this.hideAlbumCover = true
            console.log('showing vinyl player')
            this.$emit('showVinylPlayer')
        },

        onDragEnd() {
            console.log('drag end')
        },
    },
}
</script>

