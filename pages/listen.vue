<template>
    <div class="page-container">
        <div class="buttons"> 
            <b-button @click="isBrowsing = !isBrowsing"> {{isBrowsing ? 'Vinyl Player' : 'Browser'}}</b-button>
            <Sidebar :playlists="playlists" @preview="preview" /> 
        </div>
        <section class="control-panel__inner">
            <div class="browser-card">
                <Container
                    :group-name="dropName"
                    @drag-start="onDrag"
                    @drag-end="onDragEnd"
                    class="drop-container"
                >
                    
                    <Draggable 
                        class="draggable-container vinyl-container" 
                        :class="{'is-preview': isBrowsing}"
                    >
                        <Vinyl 
                            class="vinyl"
                            :isAnimating="isAnimating" 
                            :backgroundImage="backgroundImage" 
                            :isBrowsing="isBrowsing"
                            :isPlaying="isPlaying"
                        />
                    </Draggable>
                      <Preview 
                        v-if="isBrowsing"
                        :isPlaying="isPlaying"
                        :backgroundImage="backgroundImage" 
                        :class="{'is-animating-away': isAnimatingAway}"
                        @onClickPlay="onClickPlay"
                    />
                    <VinylPlayer 
                        v-if="!isBrowsing" 
                        :isPlaying="isPlaying"
                        @onClickPlay="onClickPlay"
                    />
                </Container>
                <!-- <Container 
                   
                >   
                  
                </Container> -->
                <!-- <Container
                    @drop="onClickPlay"
                    :group-name="dropName"
                    behaviour="drop-zone"
                    class="drop-container"
                    v-if="!isBrowsing" 
                >
                    <!-- <VinylPlayer 
                        :isPlaying="isPlaying"
                        @onClickPlay="onClickPlay"
                    /> -->
                <!-- </Container> -->
            </div>
            <Tracklist 
                :tracks="playlist.tracks" 
                 @onClickPlay="onClickPlay"
            />
        </section>
    </div>
</template>

<style lang="scss">
.page-container {
    background-color: $background;

    @media screen and (max-width: 780px) {
        justify-content: center;
    }
}

.buttons {
    display: flex;

    > * {
        margin-right: 1rem;
    }
}

.browser-card {
    margin: 0 2rem 2rem 0;
    width: 30rem;
    height: 30rem;
    background-color: #0a0a0a;
    border: 1px solid $grey-dark;
    box-shadow: 18px 18px 22px 5px $black;
    display: inline-block;

    .vinyl-container {
        &.is-preview &:hover {
            .vinyl-container {
                left: 4rem;
            }
        }
        transition: all 150ms ease;
    }

    @keyframes animating-away {
        from {
            transform: translate(0);
        }
        to {
            transform: translateX(-100vw);
        }
    }

    .is-animating-away {
        animation-name: animating-away;
        animation-duration: 800ms;
        animation-iteration-count: 1;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
    }

    .drop-container {
        height: 100%;
    }

    .draggable-container {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        overflow: unset !important;

        &.is-preview {
            left: 10rem;
        }
    }

    .smooth-dnd-container {
        min-height: unset;
        min-width: unset;
    }
}

.control-panel__inner {
    display: flex;
    gap: 5rem; // TODO moet mobile beter worden
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
            isBrowsing: true,
            isPlaying: false,
            dropName: 'vinyl', // This creates a drag and drop group
            isAnimating: false, // Animates vinyl when someone hovers of a playlist in the sidebar
            isAnimatingAway: false,
        }
    },
    computed: {
        ...mapGetters({
            playlists: 'playlists/getPlaylists',
        }),
        ...mapGetters({
            playlist: 'playlists/getPreview',
        }),
        backgroundImage() {
            console.log(this.playlist)
            return {
                'background-image': `url(${this.playlist.image})`,
            }
        },
    },
    methods: {
        preview(id) {
            console.log('event emitted. preview: ', id)

            const playlist = this.playlists.find((playlist) => playlist.id === id)

            this.$store.commit('playlists/SET_PREVIEW', playlist)
        },

        showVinylPlayer() {
            console.log('inside show vinyl player')

            this.isAnimatingAway = true
            setTimeout(() => {
                this.isBrowsing = false
            }, 500)

            setTimeout(() => {
                this.isAnimatingAway = false
                this.isPlaying = true
            }, 1000)
        },

        onClickPlay(sequence) {
            sequence = sequence || 1
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
            this.showVinylPlayer()
        },

        onDragEnd() {
            console.log('drag end')
            this.onClickPlay()
        },
    },
}
</script>
