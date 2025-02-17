<template>
    <div v-if="loading" class="loading_overlay">
        <div class="spinner-box-container" :style="containerStyle">
            <div class="spinner-box" :style="containerStyle">
                <div class="atom-spinner" :style="spinnerStyle">
                    <div class="spinner-inner">
                        <div class="spinner-line" :style="lineStyle"></div>
                        <div class="spinner-line" :style="lineStyle"></div>
                        <div class="spinner-line" :style="lineStyle"></div>
                        <!--Chrome renders little circles malformed :(-->
                        <div class="spinner-circle" :style="circleStyle">
                            &#9679;
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AtomSpinner',

    props: {
        animationDuration: {
            type: Number,
            default: 1000,
        },
        size: {
            type: Number,
            default: 60,
        },
        color: {
            type: String,
            default: 'red',
        },
        loading: {
            type: Boolean,
            default: false,
        },
        full: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        spinnerStyle() {
            return {
                height: `${this.size}px`,
                width: `${this.size}px`,
            }
        },

        circleStyle() {
            return {
                color: this.color,
                fontSize: `${this.size * 0.24}px`,
            }
        },

        lineStyle() {
            return {
                animationDuration: `${this.animationDuration}ms`,
                borderLeftWidth: `${this.size / 25}px`,
                borderTopWidth: `${this.size / 25}px`,
                borderLeftColor: this.color,
            }
        },

        containerStyle() {
            let steyles = {}
            if (this.full) {
                steyles = {
                    height: `100%`,
                }
            }
            return steyles
        },
    },
}
</script>

<style scoped>
.loading_overlay {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    color: #fff;
    text-align: center;
    font-size: 20px;
    background-color: rgba(221, 221, 221, 0.3);
    padding: 10px 0;
    z-index: 20;
}

.spinner-box-container {
    text-align: center;
    padding-bottom: 40px;
}

.spinner-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.atom-spinner,
.atom-spinner * {
    box-sizing: border-box;
}

.atom-spinner {
    height: 60px;
    width: 60px;
    overflow: hidden;
}

.atom-spinner .spinner-inner {
    position: relative;
    display: block;
    height: 100%;
    width: 100%;
}

.atom-spinner .spinner-circle {
    display: block;
    position: absolute;
    color: #ff1d5e;
    font-size: calc(60px * 0.24);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.atom-spinner .spinner-line {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation-duration: 1s;
    border-left-width: calc(60px / 25);
    border-top-width: calc(60px / 25);
    border-left-color: #ff1d5e;
    border-left-style: solid;
    border-top-style: solid;
    border-top-color: transparent;
}

.atom-spinner .spinner-line:nth-child(1) {
    animation: atom-spinner-animation-1 1s linear infinite;
    transform: rotateZ(120deg) rotateX(66deg) rotateZ(0deg);
}

.atom-spinner .spinner-line:nth-child(2) {
    animation: atom-spinner-animation-2 1s linear infinite;
    transform: rotateZ(240deg) rotateX(66deg) rotateZ(0deg);
}

.atom-spinner .spinner-line:nth-child(3) {
    animation: atom-spinner-animation-3 1s linear infinite;
    transform: rotateZ(360deg) rotateX(66deg) rotateZ(0deg);
}

@keyframes atom-spinner-animation-1 {
    100% {
        transform: rotateZ(120deg) rotateX(66deg) rotateZ(360deg);
    }
}

@keyframes atom-spinner-animation-2 {
    100% {
        transform: rotateZ(240deg) rotateX(66deg) rotateZ(360deg);
    }
}

@keyframes atom-spinner-animation-3 {
    100% {
        transform: rotateZ(360deg) rotateX(66deg) rotateZ(360deg);
    }
}
</style>
