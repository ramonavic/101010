<template>
    <section>
        <!-- TODO add Card component -->
    </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            playlists: 'playlists/getPlaylists'
        })
    },

    async created() {
        this.$store.dispatch('playlists/fetchPlaylists')
    }
}
</script>