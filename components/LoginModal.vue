<template>

    <form>
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Login with Magic Link</p>
            </header>
            <section class="modal-card-body">
                <p> To login we will send a magic link to your register email address. <br />
                It will be valid for 1 hour. </p> <br />
                <b-field label="Email">
                    <b-input
                        v-model="email"
                        type="email"
                        placeholder="To which email addres can we send the link?"
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
                    label="Send Me a Magic Link"
                    type="is-primary" 
                    @click.prevent="login"
                >
                </b-button>
            </footer>
        </div>
    </form>
</template>

<script>
export default {
    data() {
        return {
            email: ''
        }
    }, 
    methods: {
        async login() {

            if (this.email) {
                try {
                    const response = await this.$axios.post('/api/users/request_login', {
                      params: {
                        email: this.email
                      }
                    })
                    console.log(response)

                    this.$buefy.notification.open({
                        duration: 3000, 
                        message: `Check your inbox for the magic link!`,
                        type: 'is-success',
                        hasIcon: true,
                        position: 'is-bottom'
                    })

                } catch (err) {

                    this.$buefy.notification.open({
                        duration: 3000, 
                        message: `Something went wrong. <br /> Please try again!`,
                        type: 'is-danger',
                        hasIcon: true,
                        position: 'is-bottom'
                    })
                }

                this.$parent.$emit('close-login-modal')

            }
        },
        close() {
            console.log('inside close function', this.$parent)
            this.$parent.$emit('close-login-modal')
        }
    }

}
</script>