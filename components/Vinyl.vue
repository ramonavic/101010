<template>
    <div 
        v-bind:class="{'is-animating': isAnimating, 'is-preview': isPreview}"
        class="vinyl"   
    >   
        <div class="vinyl__outer-outer-circle">
            <div class="vinyl__outer-circle">
                <div class="vinyl__album-circle" :style="backgroundImage">
                    <div class="vinyl__hole"></div>
                </div>  
            </div>  
        </div>
    </div>
</template>

<script>
export default {
    props: {
        backgroundImage: Object,
        isAnimating: Boolean,
        isPreview: Boolean,
    },
}
</script>

<style lang="scss" scoped>
.vinyl {
    position: absolute;

    top: 0.5rem;
    z-index: $z-vinyl;
    border-radius: 50%;
    width: 29rem;
    height: 29rem;
    border: 0.25px solid $grey-dark;
    background-color: $background;
    transition: all 150ms ease;

    &.is-preview {
        left: 30%;
    }

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

    &__outer-outer-circle {
        border-radius: 50%;
        background: $background;
        position: absolute;
        z-index: $z-vinyl-outer-circle;
        top: 2.5rem;
        left: 2.5rem;
        width: 24rem;
        height: 24rem;
        // border: 0.25px solid $grey-darker;
    }

    &__outer-circle {
        border-radius: 50%;
        background: $background;
        position: absolute;
        z-index: $z-vinyl-outer-circle;
        top: 4.5rem;
        left: 4.5rem;
        width: 15rem;
        height: 15rem;
        // border: 0.25px solid $grey-darker;
    }

    &__album-circle {
        border-radius: 50%;
        position: absolute;
        z-index: $z-vinyl-album-circle;
        top: 2.5rem;
        left: 2.5rem;
        width: 10rem;
        height: 10rem;
        background-position: center;
        background-size: contain;
        border: 0.25px solid $grey;
    }

    &__hole {
        border-radius: 50%;
        position: absolute;
        z-index: $z-vinyl-hole;
        top: 3.7rem;
        left: 3.7rem;
        width: 2.5rem;
        height: 2.5rem;
        border: 0.25px solid $grey;
        background: $background;
    }
}
</style>