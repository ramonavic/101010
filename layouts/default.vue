<template>
    <div>
        <Navigation />
        <Nuxt class="container page" />
        <Player ref="player"/>
    </div>
</template>

<style lang="scss">
.page {
    margin: 2rem;
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

