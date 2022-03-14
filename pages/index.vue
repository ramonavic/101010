<template>
  <div class="hello">
    <template v-if="this.user">
      <h1> Music from the 🌍 curated with ❤️ </h1>
      <h1>Hi there, {{ this.user.name }}</h1>
      <div v-if="this.user.spotify_id">
        <!-- <img :src="this.user.image" alt="profile_picture" class="profile_pic"> -->
        <p>
          <a :href="getSpotifyProfile">Link to your profile</a>
        </p>
      </div>
      <section v-else>
        <p> You haven't connected your Spotify account yet. Do this in order to benefit of the full capabilities of the app</p>
        <p> <a href ="/api/users/connect_spotify"> Connect to Spotify </a></p>
      </section>
    </template>
  </div>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import { mapMutations } from 'vuex'

    export default {
        name: 'Home',
        computed: {
            ...mapGetters({
                user: 'user/getUser'
            }),
            getSpotifyProfile() {
              return `https://open.spotify.com/user/${this.user.spotify_id}`
            }
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
