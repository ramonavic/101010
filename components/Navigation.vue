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
                        <a class="button is-primary" @click="isRegisterModalActive = true">
                            Sign up
                        </a>
                        <b-modal 
                            v-model="isRegisterModalActive" 
                            v-on:close-subscribe-modal="onCloseSubscribeModal"
                            width:="700px"
                        >
                            <RegisterModal
                                has-modal-card
                                trap-focus
                                aria-role="dialog"
                                aria-label="Subscribe to 101010"
                                close-button-aria-label="Close"
                                aria-modal
                            />
                        </b-modal>
                        <a class="button is-light" @click="isLoginModalActive = true">
                            Login
                        </a>
                        <b-modal 
                            v-model="isLoginModalActive" 
                            width="700px" 
                            v-on:close-login-modal="onCloseLoginModal"
                        >

                            <LoginModal
                                has-modal-card
                                trap-focus
                                aria-role="dialog"
                                aria-label="Subscribe to 101010"
                                close-button-aria-label="Close"
                                aria-modal
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
    data() {
        return {
            isRegisterModalActive: false,
            isLoginModalActive: false
        }
    },
    computed: {
        ...mapGetters({
            user: 'user/getUser',
            isNotLoggedIn: 'user/isNotLoggedIn'
        })
    },
    async created() {
        console.log('inside created', this.$route.query.login_jwt)
        let response
        const loginJwt = this.$route.query?.login_jwt
        if (loginJwt) {

            try {
            response = await this.$axios.post('/api/users/jwt_login', {}, {
                headers: {
                    Authorization: `Bearer ${loginJwt}`
                }
            })
            this.$router.replace({'query': null})
            } catch (err) {
                console.log(err)
                if (err.message) {
                    window.alert(`${err.message} ${err.error}`)
                }
            }
            
        } else {
            response = await this.$axios.get('/api/users/check_auth')
        }

        if (response.data) {
            console.log('commit user data to store')
            this.$store.commit('user/mutateUser', response.data)
        }
        console.log('current state of store', this.$store.state.user)
    },
    methods: {
        logOut() {
            this.$store.dispatch('user/logout');
        },
        onCloseSubscribeModal() {
            console.log('inside close functio')
            this.isRegisterModalActive = false
        },
        onCloseLoginModal() {
            console.log('inside close functio')
            this.isLoginModalActive = false
        }
    }
    
}
</script>

