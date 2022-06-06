<template>
    <section>
         <Container
            @drop="onClickPlay"
            :group-name="dropName"
            behaviour="drop-zone"
        >
            <div v-if="playlist" class="card">
                <Vinyl :class="{'is-spinning': isPlaying}" :backgroundImage="backgroundImage"/>
                <!-- <div class="top">
                    <div class="title over-image"> {{playlist.name}} </div>
                </div>         -->
                <div class="needle" :class="{'is-playing': isPlaying}">

                </div>
            </div>
         </Container>
        <div class="card-footer">

            <!-- TODO hier moet een Spotify icoon komen -->
            <a href="#" @click="onClickPlay" class="card-footer-item">Play</a>

            <!-- <a href="#" class="card-footer-item">Open in Spotify</a> -->
            <!-- TODO hier moet een hartje icoon komen -->
            <a href="#" class="card-footer-item">Add Playlist</a>
        </div>
    </section>
</template>

<style scoped lang="scss">
.card {
    margin: 0 2rem 2rem 0;
    width: 30rem;
    height: 30rem;
    background-color: #0a0a0a;
    border: 1px solid $grey-dark;
    box-shadow: 18px 18px 22px 5px $black;
    display: inline-block;

    .is-spinning {
        animation-name: spin;
        animation-duration: 5000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

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
}
</style>

<script>
import { mapGetters } from 'vuex'
import { Container } from 'vue-smooth-dnd'

export default {
    components: {
        Container,
    },
    data() {
        return {
            spotifyUser: 'ramonavic',
            isPlaying: false,
            dropName: 'vinyl', // This creates a drag and drop group
        }
    },
    computed: {
        // createdDate() {
        //     return new Date(this.playlist.created_at).toDateString()
        // },
        backgroundImage() {
            console.log(this.playlist)
            return {
                'background-image': `url(${this.playlist.image})`,
            }
        },
        ...mapGetters({
            playlist: 'player/getCurrentPlaylist',
        }),
    },
    methods: {
        onClickPlay() {
            // Find the player component thats attached to default.vue
            const rootPage = this.$root.$children.find((child) => {
                // Look for property isRoot
                return child.isRoot
            })

            const player = rootPage?.$refs?.player

            if (player) {
                player.preparePlay(this.getPlaylistUri())

                this.isPlaying = true
            } else {
                // TODO throw through confirm
            }
        },
        getPlaylistUri() {
            return `spotify:user:${this.spotifyUser}:playlist:${this.playlist.spotify_id}`
        },

        onDrop() {
            console.log('dropped vinyl in player')
        },
    },
}
</script>

