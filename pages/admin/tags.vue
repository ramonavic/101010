<template class="container">
    <section class="forms-container">   
        <form class="container box admin-form">
        <b-field label="Playlist">
             <b-taginput 
                v-model="chosenPlaylist" 
                placeholder="Choose playlist"
                autocomplete
                open-on-focus
                :data="filteredPlaylists"
                @typing="getFilteredPlaylists"
                icon="label"
                maxtags=1  
            >
            </b-taginput>
        </b-field>

        {{this.playlistNames }}
        
        
        <b-field label="Tags">
            <b-taginput 
                v-model="chosenTags" 
                aria-close-label="Delete tag"
                placeholder="Add new or existing tag"
                ellipsis
                autocomplete
                allow-new
                open-on-focus
                :data="filteredTagNames"
                @typing="getFilteredTags"
                icon="label"    
            >
            </b-taginput>
        </b-field>
        <br />
        <h2> Current tag names </h2>
        {{ this.tagNames}}
        <br />
        <hr />
        <b-button @click="addTagsToPlaylist"> Add tags</b-button>
        </form>
    </section>
</template>

<style lang="scss" scoped>
.admin-form {
    max-width: 30rem;
    margin: 1rem;
}

.forms-container {
    display: flex;
    flex-wrap: wrap;
    margin: 2rem;
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            chosenTags: [],
            chosenPlaylist: [],
        }
    },
    computed: {
        ...mapGetters({
            tags: 'tags/getTags',
            tagNames: 'tags/getTagNames',
            playlistNames: 'playlists/getPlaylistNames',
            playlists: 'playlists/getPlaylists',
        }),
        filteredTagNames: {
            get() {
                return this.$store.getters['tags/getFilteredTagNames']
            },
            set(query) {
                this.$store.commit('tags/SET_FILTERED_TAGS', query)
            },
        },
        filteredPlaylists: {
            get() {
                return this.$store.getters['playlists/getFilteredPlaylistNames']
            },
            set(query) {
                this.$store.commit('playlists/SET_FILTERED_PLAYLISTS', query)
            },
        },
    },
    async beforeMount() {
        this.updateData()
    },
    methods: {
        updateData() {
            this.$store.dispatch('tags/fetchTags')
            this.$store.dispatch('playlists/fetchPlaylists')
        },

        addTagsToPlaylist() {
            const tagsForPlaylist = this.prepareTagsForPlaylist()
            const data = {
                playlistId: this.getPlaylistIdForName(),
                tagsForPlaylist,
            }

            this.$store.dispatch('tags/addTagsToPlaylist', data)
        },

        getFilteredTags(text) {
            this.filteredTagNames = this.tagNames.filter((name) => {
                return name.toString().toLowerCase().indexOf(text.toLowerCase()) >= 0
            })
        },

        getFilteredPlaylists(text) {
            this.filteredPlaylists = this.playlistNames.filter((name) => {
                return name.toString().toLowerCase().indexOf(text.toLowerCase()) >= 0
            })
        },

        getPlaylistIdForName() {
            const playlist = this.playlists.find((playlist) => playlist.name === this.chosenPlaylist[0])
            return playlist.id
        },

        prepareTagsForPlaylist() {
            return this.chosenTags.map((chosenTagName) => {
                const existingTag = this.tags.find((tag) => tag.name === chosenTagName)
                if (!existingTag) {
                    return {
                        chosenTagName,
                        isNew: true,
                    }
                }
                return existingTag
            })
        },
    },
}
</script>