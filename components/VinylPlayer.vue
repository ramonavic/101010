<template>
    <div v-if="playlist" class="container card">
        <div class="top">
            <div class="title over-image"> {{playlist.name}} </div>
            <div class="card-image" :style="backgroundImage" v-bind:class="{'is-spinning': isPlaying}">
                <div class="album-cover__center"></div>
            </div>
            <div class="card-content">
                <!-- {{playlist.description}} -->

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
        <div class="card-footer">

            <!-- TODO hier moet een Spotify icoon komen -->
            <a href="#" @click="onClickPlay" class="card-footer-item">Play</a>

            <!-- <a href="#" class="card-footer-item">Open in Spotify</a> -->
            <!-- TODO hier moet een hartje icoon komen -->
            <a href="#" class="card-footer-item">Add Playlist</a>
        </div>
    </div>

</template>

<style scoped lang="scss">
.card {
    margin: 0 2rem 2rem 0;
    max-width: 24.57rem !important;
    background-color: #0a0a0a;
    border: 1px solid $grey-dark;
    box-shadow: 18px 18px 22px 5px $black;
    display: inline-block;

    .top {
        position: relative;
        margin: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .card-image {
        z-index: $z-card-image;
        margin-bottom: 1rem;
        height: 20rem;
        width: 20rem;
        background-repeat: no-repeat;
        background-position: top;
        background-size: cover;
        filter: blur(1px);
        border-radius: 50%;

        &.is-spinning {
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

        .album-cover__center {
            border-radius: 50%;
            background: $background;
            position: absolute;
            z-index: $z-album-cover;
            top: 8.71rem;
            left: 8.71rem;
            width: 2rem;
            height: 2rem;
        }
    }

    .card-content {
        position: absolute;
        bottom: 0rem;
        right: 0.75rem;
        z-index: 2;
        padding: 0;
        color: $white;
        display: flex;
        justify-content: flex-end;

        a {
            color: $white;

            &:hover {
                color: $grey-lighter;
            }
        }
    }

    .playlist {
        padding: 0 1rem;
        background-color: #0a0a0a;
    }

    .tags {
        margin-bottom: 0;
        font-size: 0.88rem;
    }
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            spotifyUser: 'ramonavic',
            isPlaying: false,
        }
    },
    computed: {
        createdDate() {
            return new Date(this.playlist.created_at).toDateString()
        },
        embedLink() {
            return `https://open.spotify.com/embed/playlist/${this.playlist.spotify_id}?utm_source=generator&theme=0`
        },
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
    },
}
</script>

