<template>
    <div class="page-container">
        <div class="buttons"> 
            <b-button @click="isBrowsing = !isBrowsing"> {{isBrowsing ? 'Vinyl Player' : 'Browser'}}</b-button>
            <Sidebar :playlists="playlists" @preview="preview" /> 
        </div>
        <div class="browser" v-if="isBrowsing">
            <Preview @showVinylPlayer="isBrowsing = false"/>
        </div>

        <div v-else class="vinyl">
            <Container
                @drop="onDrop"
                :group-name="dropName"
                behaviour="drop-zone"
            >
                <VinylPlayer />
            </Container>
        </div>
    </div>
</template>

<style lang="scss">
.page-container {
    background-color: $background;

    @media screen and (max-width: 780px) {
        justify-content: center;
    }
}

.buttons {
    display: flex;

    > * {
        margin-right: 1rem;
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
