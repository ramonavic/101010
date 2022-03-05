<template>
    <section>
        <!-- TODO add Card component -->
    </section>
</template>

<script>
export default {
    async created() {
        const playlists = await this.$axios.get('/api/get_playlists')
    }
}
</script>