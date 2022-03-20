<template>
    <div>
        <Navigation />
        <Nuxt class="container page" />
    </div>
</template>

<style lang="scss">
html,
body {
    background-color: $background;
}

.page {
    margin: 2rem;
}

h1 {
    color: $grey-lighter;
}

p {
    color: $grey-lighter;
}
</style>
