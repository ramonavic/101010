<template>

    <form>
        <div class="modal-card" style="max-width: 50rem">
            <header class="modal-card-head">
                <p class="modal-card-title">Register</p>
            </header>
            <section class="modal-card-body">
                <p> <h3> We recommend the following steps to make complete use of 101010: </h3>
                    <ol>
                        <li> Register your email address and click on the magic link in your inbox to login. </li>
                        <li> Choose to subscribe to email updates to get the latest playlists. </li>
                        <li> Connect your <strong> Premium Spotify account </strong> to make use of our integration. </li>
                    </ol>
                </p>
            </section>
            <section class="modal-card-body">
                <b-field label="Name">
                    <b-input
                        v-model="name"
                        placeholder="How should we call you?"
                        required
                    >
                    </b-input>
                </b-field>
            </section>
            <section class="modal-card-body">
                <b-field label="Email">
                    <b-input
                        v-model="email"
                        type="email"
                        placeholder="How do we reach you?"
                        required
                    >
                    </b-input>
                </b-field>
            </section>

            <!-- TODO add checkbox: I want to receive emails when new playlists come out -->

            <footer class="modal-card-foot">
                <b-button
                    label="Cancel"
                    @click.prevent="close"
                >
                </b-button>
                <b-button
                    label="Connect Spotify"
                    type="is-primary" 
                    @click.prevent="connectSpotify"
                >
                </b-button>
                <b-button
                    label="Send Me a Magic Link"
                    type="is-primary" 
                    @click.prevent="register"
                >
                </b-button>
            </footer>
        </div>
    </form>
</template>

<style lang="scss" scoped>
.modal-card-body {
    padding: 1rem;
    background-color: $background;

    h3 {
        font-size: 1.5rem !important;
    }

    ol {
        margin: 1rem 0 0 2rem;
    }

    input {
        &::placeholder {
            color: $grey-darkest;
        }
    }
}

.modal-card-foot {
    justify-content: space-between;
}
</style>

<script>
export default {
    data() {
        return {
            name: '',
            email: '',
            subscribeToMail: false,
        }
    },
    methods: {
        register() {
            console.log(this.$data)
            console.log('inside register', this.name, this.email)
            if (this.name && this.email) {
                console.log(this.$data)
                this.$axios.post('/api/users/register', {
                    params: {
                        ...this.$data,
                    },
                })
            }
        },
        connectSpotify() {
            this.$axios.get('/api/users/connect_spotify')
        },

        close() {
            console.log('inside close function', this.$parent)
            this.$parent.$emit('close-subscribe-modal')
        },
    },
}
</script>

