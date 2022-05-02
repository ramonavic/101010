<template>
    <section>
        <div class="card">
            <div class="vinyl" v-bind:class="{'is-animating': isAnimating}" ></div>
            <div class="card-image" :style="backgroundImage">
                <div class="top">
                    <div class="name"> {{playlist.name}} </div>
                </div>
                <div class="play-btn" @click="onClickPlay()">
                    <b-icon
                        custom-size="mdi"
                        icon="play"
                    ></b-icon>               
                </div>
                <div class="tags-container">

                    <b-taglist>
                        <template v-for="tag in playlist.tags">
                            <b-tag v-if="tag.is_theme" :key="tag.id" type="is-primary">
                                {{tag.name}}
                            </b-tag>
                            <b-tag  v-else :key="tag.id" type="is-grey">
                                {{tag.name}}
                            </b-tag>
                        </template>
                    </b-taglist>
                </div>
            </div>
        </div>
        <div class="card tracklist">
            <div class="top"> 
                <span class="header"> TRACKLIST </span>
                <template v-for="track in playlist.tracks" >
                    <span class="track" :key="track.id" @click="onClickPlay(track.sequence)"> 
                        {{track.sequence}}. {{track.artists}} - {{track.title}}  
                    </span>
                </template>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
section {
    display: flex;
    gap: 5rem; // TODO moet mobile beter worden
}

.card {
    width: 30rem !important;
    height: 30rem;
    border: 1px solid $grey-dark;
    box-shadow: 18px 18px 22px 5px $black;
    background-color: $background;
    cursor: pointer;

    &:hover {
        .vinyl {
            transition: all 150ms ease;
            left: 33%;
        }
    }

    .card-image {
        height: 100%;
        width: 100%;
        background-repeat: no-repeat;
        background-position: top;
        background-size: cover;
        position: absolute;
        background-color: $background;
        top: 0;
        z-index: 2;
    }

    .play-btn {
        position: absolute;
        top: calc(50% - 21px); // 21px is half of the is-large icon size.
        display: flex;
        justify-content: center;
        width: 100%;
        color: $grey-darker;
        font-size: 80px;

        &:hover {
            transition: all 150ms ease;
            transform: scale(1.1);
        }
    }

    .vinyl {
        position: absolute;
        left: 30%;
        top: 0.5rem;
        z-index: 1;
        border-radius: 50%;
        width: 29rem;
        height: 29rem;
        border: 1px solid #fff;
        background-color: $background;
        transition: all 150ms ease;

        &.is-animating {
            animation-name: show;
            animation-duration: 800ms;
            animation-iteration-count: 1;
            animation-timing-function: linear;
        }

        @keyframes show {
            from {
                left: 30%;
                display: block;
            }
            40% {
                display: none;
                left: 0;
            }
            75% {
                display: block;
                left: 0;
            }
            to {
                left: 30%;
            }
        }
    }

    .top {
        position: relative;
        margin: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow-y: scroll;

        .name {
            padding: 0.5rem;
            border-radius: 0.4rem;
            background-color: $background;
        }

        .header {
            margin: 0.8rem;
        }

        .track {
            font-size: 0.8rem;
            overflow-x: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 100%;
            text-align: center;
            line-height: 2rem;
            cursor: pointer;
            transition: all 150ms ease;

            &:hover {
                color: $grey-light;
            }
        }
    }

    .playlist {
        padding: 0 1rem;
        background-color: #0a0a0a;
    }

    .tags-container {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
    }
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            spotifyUser: 'ramonavic',
            isPlaying: false,
            isAnimating: false,
        }
    },
    computed: {
        createdDate() {
            return new Date(this.playlist.created_at).toDateString()
        },
        backgroundImage() {
            return {
                'background-image': `url(${this.playlist.image})`,
            }
        },
        ...mapGetters({
            playlist: 'playlists/getPreview',
        }),
    },
    watch: {
        playlist() {
            this.isAnimating = true

            setTimeout(() => {
                this.isAnimating = false
            }, 800)
        },
    },
    methods: {
        onClickPlay(sequence) {
            // Find the player component thats attached to default.vue
            const rootPage = this.$root.$children.find((child) => {
                // Look for property isRoot
                return child.isRoot
            })

            const player = rootPage?.$refs?.player

            if (player) {
                player.preparePlay(this.getPlaylistUri(), sequence)

                this.isPlaying = true
            } else {
                // TODO throw through confirm
            }
        },
        getPlaylistUri() {
            return `spotify:user:${this.spotifyUser}:playlist:${this.playlist.spotify_id}`
        },
    },
}
</script>

