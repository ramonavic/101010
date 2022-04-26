<template>
    <div class="page-container">
        <div class="browser" v-if="isBrowsing">
            <Sidebar :playlists="playlists" @preview="preview" /> 
            <Preview />
        </div>

        <div v-else class="vinyl">
            <VinylPlayer />
        </div>
    </div>
</template>

<style lang="scss">
.page-container {
    display: flex;
    background-color: $background;

    @media screen and (max-width: 780px) {
        justify-content: center;
    }
}
// .playlists-container {
//     display: flex;
//     margin: 2rem;
//     gap: 2rem;

// }
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            isBrowsing: true,
        }
    },
    computed: {
        ...mapGetters({
            playlists: 'playlists/getPlaylists',
        }),
    },
    methods: {
        preview(id) {
            console.log('event emitted. preview: ', id)

            const playlist = this.playlists.find((playlist) => playlist.id === id)

            this.$store.commit('playlists/SET_PREVIEW', playlist)
        },
    },
}
</script>
