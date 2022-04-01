<template>
    <div>
        <Navigation />
        <Nuxt class="page" />
        <Player class="player-container" ref="player"/>
    </div>
</template>

<style lang="scss" scoped>
.page {
    margin: 2rem;
    margin-bottom: 3rem;
    min-height: calc(100vh - 3rem);
}

.player-container {
    position: fixed;
    z-index: 100; // TODO create z-indexes file
    width: 100vw;
    border-top: 1px solid $grey-dark;
}
</style>

<script>
export default {
    data() {
        return {
            isRoot: true,
        }
    },
}
</script>

