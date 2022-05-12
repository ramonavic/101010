<template>
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
            <b-navbar-dropdown v-if="user && user.is_admin" label="Admin">
                <b-navbar-item href="/admin/add_playlist">
                    Add Playlist
                </b-navbar-item>
                <b-navbar-item href="/admin/tags">
                    Tag Playlist
                </b-navbar-item>
            </b-navbar-dropdown>
        </template>

        <template #end>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <div v-if="isNotLoggedIn">
                        <a class="button is-primary" @click="isRegisterModalActive = true">
                            Sign up
                        </a>
                        <b-sidebar 
                            v-model="isRegisterModalActive" 
                            v-on:close-subscribe-modal="onCloseSubscribeModal"
                            :fullwidth=true
                            :fullheight=true
                            :right=true
                        >
                            <RegisterModal
                                aria-label="Subscribe to 101010"
                            />
                        </b-sidebar>
                        <a class="button is-light" @click="isLoginModalActive = true">
                            Login
                        </a>
                        <b-sidebar 
                            v-model="isLoginModalActive" 
                            width="700px" 
                            v-on:close-login-modal="onCloseLoginModal"
                            :fullwidth=true
                            :fullheight=true
                            :right=true
                        >

                            <LoginModal
                                aria-label="Subscribe to 101010"
                            />
                        </b-sidebar>
                      
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

<style lang="scss">
.nav {
    box-shadow: unset;
    border-bottom: 1px solid $grey-dark;
    border-radius: 0px;
    z-index: $z-nav !important;
}

.b-sidebar {
    .is-fullheight {
        justify-content: center;
        margin-top: -4rem; // Minus height of player
    }
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            isRegisterModalActive: false,
            isLoginModalActive: false,
        }
    },
    computed: {
        ...mapGetters({
            user: 'user/getUser',
            isNotLoggedIn: 'user/isNotLoggedIn',
        }),
    },
    async mounted() {
        let response
        const loginJwt = this.$route.query?.login_jwt
        if (loginJwt) {
            try {
                response = await this.$axios.post(
                    '/api/users/jwt_login',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${loginJwt}`,
                        },
                    }
                )
                this.$router.replace({ query: null })
            } catch (err) {
                console.log('caught error', err)

                this.$buefy.notification.open({
                    message: `The login link is invalid or expired. <br /> Please request another one.`,
                    type: 'is-danger',
                    hasIcon: true,
                    indefinite: true,
                    closable: true,
                    position: 'is-bottom',
                })

                return
            }
        } else {
            response = await this.$axios.get('/api/users/check_auth')
        }

        if (response?.data) {
            this.$store.commit('user/MUTATE_USER', response.data)
        }
        console.log('current state of user store', this.$store.state.user)
    },
    methods: {
        logOut() {
            this.$store.dispatch('user/logout')
        },
        onCloseSubscribeModal() {
            this.isRegisterModalActive = false
        },
        onCloseLoginModal() {
            this.isLoginModalActive = false
        },
    },
}
</script>

