<template>

    <form>
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Register</p>
            </header>
              <section class="modal-card-body">
                <b-field label="Name">
                    <b-input
                        v-model="name"
                        placeholder="How would you like us to call you?"
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
                        placeholder="How can we reach you?"
                        required
                    >
                    </b-input>
                </b-field>
            </section>

            <!-- TODO add checkbox: I want to receive emails when new playlists come out -->

            <footer class="modal-card-foot">
                <b-button
                    label="Close"
                    @click.prevent="close"
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

<script>
export default {
    data() {
        return {
            name: '',
            email: '',
            subscribeToMail: false
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
                        ...this.$data
                    }
                })
            }
        },
        close() {
            console.log('inside close function', this.$parent)
            this.$parent.$emit('close-subscribe-modal')
        }
    }

}
</script>