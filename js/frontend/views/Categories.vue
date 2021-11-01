<template>
    <v-container class="mt-5 mb-10 px-3">
        <v-carousel
            :cycle="true"
            height="200"
            class="mb-3"
            hide-delimiters
            v-if="promotions && promotions.length > 0"
        >
            <v-carousel-item
                v-for="promotion in promotions"
                :key="promotion.id"
                :to="
                    promotion.meal
                        ? {
                              name: 'promotion',
                              params: { originalMeal: promotion.meal },
                          }
                        : null
                "
            >
                <v-sheet height="100%" tile>
                    <v-img :src="promotion.image_path" height="300px"></v-img>
                </v-sheet>
            </v-carousel-item>
        </v-carousel>
        <v-row>
            <v-col v-for="(c, index) in categories" :key="c.id" cols="6" md="2">
                <v-card
                    elevation="3"
                    style="
                        background-color: black;

                        border: 1.5px solid #961b1e !important;
                        border-radius: 20px;
                    "
                    :to="{
                        name: 'meals',
                        params: { destinationCategory: index },
                    }"
                >
                    <v-img
                        lazy-src="/images/logo.png"
                        :src="c.image_path"
                        height="200px"
                    ></v-img>

                    <v-card-title class="card-title" v-html="c.name">
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Categories',
    data: () => ({ drawer: null }),
    computed: {
        ...mapGetters(['categories', 'cart', 'promotions']),
    },
    mounted() {
        window.scrollTo(0, 0)
    },
}
</script>

<style>
.huge-input input {
    font-size: 50px;
    text-align: center;
    max-height: 70px !important;
}
.v-overlay__scrim {
    top: 33% !important;
    height: 33% !important;
    border-radius: unset !important;
}
.rounded-card {
    border-radius: 70%;
    border-color: #00c0ef;
    border-width: 10px;
}
.card-title {
    background-color: black;
    color: white;
    padding: 9px !important;
    border-radius: 20% !important;
    font-size: 15px !important;
    word-break: normal !important;
}
.v-carousel__controls__item {
    color: black !important;
    border: 3px solid #961b1e !important;
}
</style>
