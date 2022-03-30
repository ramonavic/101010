<template>
    <div class="container card">
        <div class="top">
            <div class="card-image" :style="backgroundImage"></div>
            <div class="title over-image"> {{playlist.name}} </div>
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
                <!-- <br> -->
                <!-- <span> 
                    <b-icon icon="clock"></b-icon>
                    <time datetime="2016-1-1">{{createdDate}}</time>
                </span> -->
            </div>
        </div>

        <b-button v-on:click="onClickPlay"> Play</b-button>

        <!-- <iframe :src="embedLink" class="playlist" width="100%" height="250" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe> -->
        <footer class="card-footer">

            <!-- TODO hier moet een Spotify icoon komen -->
            <a href="#" class="card-footer-item">Open in Spotify</a>
            <!-- TODO hier moet een hartje icoon komen -->
            <a href="#" class="card-footer-item">Add Playlist</a>
        </footer>
    </div>
</template>

<style scoped lang="scss">
.card {
    margin: 0 2rem 2rem 0;
    max-width: 400px !important;
    background-color: #0a0a0a;
    border: 1px solid $grey-dark;
    box-shadow: 18px 18px 22px 5px $black;
    display: inline-block;

    .over-image {
        position: absolute;
        top: 2rem;
        left: 2rem;
        z-index: 2;
    }

    .top {
        position: relative;
        margin: 1rem;
    }

    .card-image {
        z-index: 1;
        margin-bottom: 1rem;
        height: 15em;
        width: 100%;
        background-repeat: no-repeat;
        background-position: top;
        background-size: cover;
        filter: blur(1px);
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
export default {
    data() {
        return {
            spotifyUser: 'ramonavic',
        }
    },
    props: {
        playlist: {
            type: Object,
        },
        playlistLength: Number,
    },
    computed: {
        createdDate() {
            return new Date(this.playlist.created_at).toDateString()
        },
        embedLink() {
            return `https://open.spotify.com/embed/playlist/${this.playlist.spotify_id}?utm_source=generator&theme=0`
        },
        backgroundImage() {
            console.log('getting baxkground', this.playlist.image)
            return {
                'background-image': `url(${this.playlist.image})`,
            }
        },
    },
    methods: {
        onClickPlay() {
            // Find the player component thats attached to default.vue
            const rootPage = this.$root.$children.find((child) => {
                console.log('child', child)

                // Look for property isRoot
                return child.isRoot
            })

            console.log(rootPage)

            const player = rootPage?.$refs?.player

            if (player) {
                player.preparePlay(this.getPlaylistUri())
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

