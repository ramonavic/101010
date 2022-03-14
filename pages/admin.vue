<template class="container">
    <section>   
        <form class="container box admin-form" v-on:submit.prevent="getPlaylistInfo">
            <b-field label="Get Playlist info">
                <b-input v-model="id" placeholder="Fill in playlist id"></b-input>
            </b-field>
            <div v-if="this.name"> 
                <p> 
                    Name: {{ name }} <br />
                    Description:  {{ description }} <br />
                    Image url:  {{ image }} 
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

            <!-- TODO add tags -->
            <b-button class="is-primary" v-on:click="addPlaylist">Submit</b-button>
        </form>
    </section>
</template>

<style scoped>
.admin-form {
    width: 70%;
}
</style>

<script>
export default {
    data() {
        return {
            name: null,
            id: null, 
            image: null,
            description: null
        }
    },
    methods: {
        async getPlaylistInfo() {
            const playlistId = this.id
            console.log('getting playlist info for: ', this.id)
            const playlist = await this.$axios.get(`/api/playlists/get_playlist/${playlistId}`)
            console.log(playlist)

            if (playlist.data) {
                this.name = playlist.data.name
                this.id = playlistId
                this.image = playlist.data.images[0].url
                this.description = playlist.data.description
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
                }
            })

            console.log(response)
        }
    }
}
</script>