<template>
    <v-container class="meals_container bck">
        <v-tabs
            v-model="category"
            background-color="#040404"
            color="black"
            next-icon="mdi-menu-right"
            prev-icon="mdi-menu-left"
            show-arrows
        >
            <v-tabs-slider color="#961b1e"></v-tabs-slider>
            <v-tab v-for="cat in categories" :key="cat.id">
                <span style="color: white; font-weight: bold">{{
                    cat.name
                }}</span>
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="category" class="mb-12 px-3 bck">
            <v-tab-item v-for="cat in categories" :key="cat.id">
                <v-row>
                    <v-col
                        v-for="meal in cat.meals"
                        :key="`${cat.id}_${meal.id}`"
                        cols="6"
                        md="2"
                    >
                        <meal
                            :meal="meal"
                            @showDescription="showDescription"
                        ></meal>
                    </v-col>
                </v-row>
            </v-tab-item>
        </v-tabs-items>
        <description-dialog
            :description="description"
            :activated="activator"
        ></description-dialog>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Meal from './components/Meal'
import DescriptionDialog from './components/DescriptionDialog'
import description_dialog from '../mixins/description_dialog'

export default {
    name: 'Meals',
    components: { DescriptionDialog, Meal },
    mixins: [description_dialog],
    props: {
        destinationCategory: {
            type: Number,
            default: 0,
        },
    },
    data: () => ({
        category: 0,
    }),
    computed: {
        ...mapGetters(['categories']),
    },
    mounted() {
        window.scrollTo(0, 0)
        this.category = parseInt(this.destinationCategory)
    },
}
</script>

<style>
.huge-input input {
    font-size: 25px !important;
    text-align: center;
    margin-top: 5px;
}
.v-overlay__scrim {
    top: 20% !important;
    height: 25% !important;
    border-radius: 20px !important;
}
.container.meals_container {
    padding: 0 !important;
}
.v-card__title {
    max-height: 82px;
    height: 82px;
}
.mdi-menu-right::before {
    color: white;
}
.mdi-menu-left::before {
    color: white;
}

.bck {
    background-color: #040404 !important;
}

.info-icon {
    position: absolute !important;
    right: 3px;
    bottom: 3px;
    padding: 3px;
    color: #961b1e !important;
}
.theme--light.v-tabs-items {
    margin-top: 20px !important;
}
</style>
