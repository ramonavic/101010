<template>
  <div class="hello">
    <section>
      <div>
        <h1 class="title"> Digging in the Waves </h1>
        <h3 class="subtitle"> Music from the 🌍 curated with ❤️ </h3>
      </div>
    </section>
    <section v-if="this.user"> 
      <h3>Hi there, {{ this.user.name }}</h3>
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
    </section>
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
            user: 'user/getUser',
        }),
        getSpotifyProfile() {
            return `https://open.spotify.com/user/${this.user.spotify_id}`
        },
    },
}
</script>

<style>
h1 {
    font-size: 6rem !important;
}

h3 {
    font-size: 3rem !important;
}

.profile_pic {
    width: 100px;
}
</style>
