<template :v-on:close-subscribe-modal="onCloseSubscribeModal">
    <b-navbar class="nav">
        <template #start>
            <b-navbar-item href="/">
                Home
            </b-navbar-item>
            <b-navbar-item href="/listen">
                Listen
            </b-navbar-item>
            <b-navbar-item href="#">
                Saved Playlists
            </b-navbar-item>
            <b-navbar-item href="/admin">
                Admin
            </b-navbar-item>
            <!-- <b-navbar-dropdown label="Info">
                <b-navbar-item href="#">
                    About
                </b-navbar-item>
                <b-navbar-item href="#">
                    Contact
                </b-navbar-item>
            </b-navbar-dropdown> -->
        </template>

        <template #end>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <div v-if="isNotLoggedIn">
                        <a class="button is-light" @click="isSubscribeModalActive = true">
                            Sign up
                        </a>
                        <b-modal v-model="isSubscribeModalActive">

                            <RegisterModal
                                has-modal-card
                                trap-focus
                                aria-role="dialog"
                                aria-label="Subscribe to 101010"
                                close-button-aria-label="Close"
                                aria-moda
                            />
                        </b-modal>
                           <a href="/api/users/connect_spotify" class="button is-primary">
                            <strong>Connect Spotify</strong>
                        </a>
                    </div>
                    <div v-else>
                        <a v-on:click=logOut() class="button is-light"> 
                            Logout
                        </a>
                        <a href="/settings" class="button is-light">
                            Settings
                        </a>
                    </div>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<style lang="scss" scoped>
.nav {
    margin-bottom: 3rem;
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    // components: {
    //     RegisterModal
    // },
    data() {
        return {
            isSubscribeModalActive: false
        }
    },
    computed: {
        ...mapGetters({
            user: 'user/getUser',
            isNotLoggedIn: 'user/isNotLoggedIn'
        })
    },
    methods: {
        logOut() {
            this.$store.dispatch('user/logout');
        },
        onCloseSubscribeModal() {
            console.log('inside close functio')
            this.isSubscribeModalActive = false
        }
    }
    
}
</script>

