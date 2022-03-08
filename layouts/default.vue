<template>
    <div>
        <Navigation />
        <Nuxt class="container page" />
    </div>
</template>

<style lang="scss">
html {
    background-color: $background;
}

.page {
    max-width: 80%;
}

h1 {
    color: $grey-lighter;
}

p {
    color: $grey-lighter;
}
</style>
