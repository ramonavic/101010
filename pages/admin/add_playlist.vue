<template class="container">
    <section class="forms-container">   
        <form class="container box admin-form" v-on:submit.prevent="getPlaylistInfo">
            <b-field label="Get Playlist info">
                <b-input v-model="id" placeholder="Fill in playlist id"></b-input>
            </b-field>
            <div v-if="this.name"> 
                <p> 
                    Name: {{ name }} <br />
                    Description:  {{ description }} <br />
                    Image url:  {{ image }} 
                    Amount of tracks: {{ this.tracks.length }}
                </p>
            </div>
        </form>

        <form class="container box admin-form" v-on:submit.prevent="addPlaylist">
            <h1> Insert Playlist </h1>
            <b-field label="Name">
                <b-input placeholder="Name" v-model="name"></b-input>
            </b-field>
            <b-field label="ID">
                <b-input placeholder="ID" v-model="id"></b-input>
            </b-field>
            <b-field label="Description">
                <b-input placeholder="Description" v-model="description"></b-input>
            </b-field>
             <b-field label="Image">
                <b-input placeholder="imageUrl" v-model="image"></b-input>
            </b-field>  
            <b-button class="is-primary" v-on:click="addPlaylist">Submit</b-button>
        </form>
    </section>
</template>

<style lang="scss" scoped>
.admin-form {
    max-width: 30rem;
    margin: 1rem;
}

.forms-container {
    display: flex;
    flex-wrap: wrap;
    margin: 2rem;
}
</style>

<script>
export default {
    data() {
        return {
            name: null,
            id: null,
            image: null,
            description: null,
            tracks: [],
        }
    },
    methods: {
        async getPlaylistInfo() {
            const playlistId = this.id
            const response = await this.$axios.get(`/api/admin/get_playlist/${playlistId}`)

            if (response.data) {
                this.name = response.data.name
                this.id = playlistId
                this.image = response.data.images[0].url
                this.description = response.data.description

                console.log(response.data)
                const tracks = response.data.tracks.items.map((item, index) => {
                    return {
                        sequence: index + 1,
                        title: item.track.name,
                        artists: item.track.artists.map((artist) => artist.name).join(', '),
                        duration_ms: item.track.duration_ms,
                    }
                })

                this.tracks = tracks

                console.log(this.tracks)
            }
        },

        async addPlaylist(e) {
            console.log('inside add playlist handler')
            const response = await this.$axios.post('/api/admin/add_playlist', {
                params: {
                    name: this.name,
                    image: this.image,
                    description: this.description,
                    spotify_id: this.id,
                    tracks: this.tracks,
                },
            })

            console.log(response)
        },
    },
}
</script>