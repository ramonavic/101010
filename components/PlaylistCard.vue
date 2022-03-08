<template>
    <div class="container card">
        <div class="card-image">
            <figure class="image is-4by3">
                <img :src="playlist.image" alt="Spotify playlist">
            </figure>
            <div class="title over-image"> {{playlist.name}} </div>
        </div>
        <div class="card-content">
            <div class="media">
                <!-- <div class="media-left">
                    <figure class="image is-48x48">
                    <img :src="playlist.image" alt="Placeholder image">
                    </figure> -->
                <!-- </div> -->
                <div class="media-content">
                    <!-- <p class="title is-4">{{playlist.name}}</p> -->
                    <!-- Can contain user who has posted later -->
                    <!-- <p class="subtitle is-6"></p> --> 
                </div>
            </div>

            <div class="content">
            {{playlist.description}}

            <!-- TODO make tag component -->
            <a href="#">#css</a> <a href="#">#responsive</a>
            <br>
            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>
        </div>
        <iframe :src="getEmbedLink()" width="100%" height="250" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
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
    background-color: #191414;

    .over-image {
        position: absolute;
        bottom: 1rem;
        left: 2rem;
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

