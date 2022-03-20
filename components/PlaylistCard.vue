<template>
    <div class="container card">
        <div class="top">
            <div class="card-image" :style="getBackground()"></div>
            <div class="title over-image"> {{playlist.name}} </div>
            <div class="card-content">
                <div class="content">
                {{playlist.description}}

                <!-- TODO make tag component -->
                <a href="#">#css</a> <a href="#">#responsive</a>
                <br>
                <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                </div>
            </div>
        </div>
        <iframe :src="getEmbedLink()" class="playlist" width="100%" height="250" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
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
    margin-bottom: 2rem;
    max-width: 400px !important;
    background-color: #0a0a0a;
    border: 1px solid $grey-dark;
    box-shadow: 18px 18px 6px -3px $grey-darkest;

    .over-image {
        position: absolute;
        top: 2rem;
        left: 2rem;
        z-index: 2;
    }

    .top {
        position: relative;
        margin: 1rem;
        // background-color: #0a0a0a;
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
        bottom: 1rem;
        left: 2rem;
        z-index: 2;
        padding: 0;
        color: $white;

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
}
</style>

<script>
export default {
    props: {
        playlist: {
            type: Object
        },
        playlistLength: Number
    },

    methods: {
        getEmbedLink() {
            return `https://open.spotify.com/embed/playlist/${this.playlist.spotify_id}?utm_source=generator&theme=0`
        },
        getBackground() {
            console.log('getting baxkground', this.playlist.image)
            return {
                "background-image": `url(${this.playlist.image})`
            }
        }
    }
}
</script>

