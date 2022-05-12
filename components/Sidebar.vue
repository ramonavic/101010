<template>
  <section>
    <b-sidebar
      type="is-dark"
      :fullheight="true"
      :right="true"
      v-model="open"
    >
      <div class="p-1">
        <b-menu>
          <b-menu-list label="Browse Playlists"> 
            
            <b-menu-item 
                v-for="playlist in playlists" 
                v-bind:key="playlist.id" 
                icon="music-note" 
                :label="playlist.name"
                @mouseenter="onHover(playlist.id)">
            </b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
    <b-button @click="open = true">Choose Playlist</b-button>
  </section>
</template>

<script>
export default {
    props: {
        playlists: Array,
    },
    data() {
        return {
            open: false, // TODO make true later and then close on clicks outside of this element
            sortedPlaylists: [], // TODO decide if you want this. The theme can be a menu-list item that can expand like an accordion.
            themes: [],
            tags: [],
            active: undefined,
        }
    },
    async mounted() {
        // sort playlists by theme
        console.log(this.playlists)

        // try {
        //     // TODO only necessary if we want to sort the playlists on themes
        //     // const tags = await this.$store.dispatch('tags/fetchTags')

        //     // TODO decide: can also be done in store. So they can get there own setters.
        //     tags.forEach((tag) => {
        //         if (tag.is_theme && !this.themes.some((theme) => theme.id === tag.id)) {
        //             this.themes.push(tag)
        //             return
        //         }

        //         if (!tag.is_theme && !this.tags.some((t) => tag.id === t.id)) {
        //             this.tags.push(tag)
        //         }
        //     })
        // } catch (err) {
        //     console.error(err)
        // }

        // console.log('added themes', this.themes)
        // console.log('added tags', this.tags)
    },

    methods: {
        onHover(id) {
            this.$emit('preview', id)
        },
    },
}
</script>

<style>
.p-1 {
    padding: 1em;
}
</style>
