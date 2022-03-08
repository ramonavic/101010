<template>
  <div class="hello">
    <template v-if="this.user">
      <h1> Music from the 🌍 curated with ❤️ </h1>
      <h1>Hi there, {{ this.user.display_name }}</h1>
      <img :src="this.user.images[0].url" alt="profile_picture" class="profile_pic">
      <p>
        <a :href="this.user.profileUrl">Link to your profile</a>
      </p>
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
            })
        },
        methods: {

        },

        // TODO bepalen of dit niet beter naar navigatie kan gaan. Mogelijk minpunt is dat hij dan 
        // heel vaak wordt getriggered
        async created() {
            console.log('inside created')

            const response = await this.$axios.get('/api/users/check_auth')

            if (response.data) {
              console.log('commit user data to store')
              this.$store.commit('user/mutateUser', response.data)
            }

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
