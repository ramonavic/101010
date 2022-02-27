<template>
  <div class="hello">
    <template v-if="this.user">
      <h1>Hi there, {{ this.user.display_name }}</h1>
      <img :src="this.user.images[0].url" alt="profile_picture" class="profile_pic">
      <p>
        <a :href="this.user.profileUrl">Link to your profile</a>
        <button v-on:click="logOut()" class="btn btn-primary">Log out</button>
        <button v-on:click="checkAuthState()" class="btn btn-primary">Check Auth</button>
        <button v-on:click="getPlaylist()" class="btn btn-primary">Get playlist</button>
      </p>
    </template>
    <template v-else>
      <h1>Log in to Spotify using Authorization Code flow</h1>
      <a href="/api/login" class="btn btn-primary">Log in with Spotify</a><br>
    </template>
  </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        name: 'Index',
        computed: {
            user() {
                return this.$store.getters.getUser
            }
        },
        methods: {
            logOut() {
                this.$store.commit('mutateUser', null);
                this.$router.push({ name: 'Home'})
            },

            checkAuthState() {
                this.$axios.get('/api/authenticated', {
                    withCredentials: true
                })
            },

            async getPlaylist() {
                const playlist = await this.$axios.get('/api/spotify/get_playlist')
                console.log(playlist)
            }
        },
        async created() {

            const response = await this.$axios.get('/api/check_auth')

            if (response.data) {
              console.log('commit to store')
              this.$store.commit('mutateUser', response.data)
            }

            console.log('inside created')
            console.log('current state of store', this.$store.state.user)
        }
    }
</script>

<style scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}

.profile_pic {
    width: 100px;
}
</style>
