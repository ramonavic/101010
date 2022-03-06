<template class="container">
    <section>   
        <form class="box admin-form" v-on:submit.prevent="getPlaylistInfo">
            <b-field label="Get Playlist info">
                <b-input placeholder="Fill in playlist id"></b-input>
            </b-field>
            <div v-if="this.name"> 
                <p> 
                    Name: {{ name }} <br />
                    Description:  {{ description }} <br />
                    Image url:  {{ image }} 
                </p>
            </div>
        </form>

        <form class="box admin-form" v-on:submit.prevent="addPlaylist">
            <h1> Insert Playlist </h1>
            <b-field label="Name">
                <b-input placeholder="Name" v-bind-value="this.name" v-model="this.name"></b-input>
            </b-field>
            <b-field label="ID">
                <b-input placeholder="ID" v-bind-value="this.id" v-model="this.id"></b-input>
            </b-field>
            <b-field label="Description">
                <b-input placeholder="Description" v-bind-value="this.description" v-model="this.description"></b-input>
            </b-field>
             <b-field label="Image">
                <b-input placeholder="imageUrl" v-bind-value="this.image" v-model="this.image"></b-input>
            </b-field>   
        </form>
    </section>
</template>

<style scoped>
.admin-form {
    width: 50%;
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
        async getPlaylistInfo(e) {
            console.log('inside get playlist info', e.currentTarget[0].value)
            const playlistId = e.target[0].value
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
            const response = await this.$axios.post('/api/admin/add_playlist', {
                params: {
                    id: this.id, 
                    name: this.name,
                    image: this.image,
                    description: this.description
                }
            })

            console.log(response)
        }
    }
}
</script>