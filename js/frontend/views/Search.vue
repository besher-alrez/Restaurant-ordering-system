<template>
    <v-container class="mt-5 mb-10 px-3">
        <span style="color: white" class="title">Search Results</span>
        <v-row v-if="results.length === 0">
            <v-col class="text-center">
                <v-icon color="#961b1e" size="200">mdi-alert-outline</v-icon>
                <p style="color: #961b1e" class="title font-weight-bold">
                    No Results Found
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="meal in results" :key="meal.id" cols="6" md="2">
                <meal :meal="meal" @showDescription="showDescription"></meal>
            </v-col>
        </v-row>
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
    name: 'Search',
    components: { DescriptionDialog, Meal },
    mixins: [description_dialog],
    props: {
        keyword: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            results: [],
        }
    },
    computed: {
        ...mapGetters(['categories']),
    },
    watch: {
        $route: 'fetchData',
    },
    created() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            if (this.keyword) {
                let searched_meals = []
                let char = this.keyword
                let categories = this.categories
                Object.keys(categories).forEach(function (key) {
                    let val = categories[key]

                    Object.keys(val.meals).forEach(function (id) {
                        let meals = val.meals[id]
                        let include = meals.name.includes(char, 0)
                        if (include) {
                            searched_meals.push(meals)
                        }
                    })
                })
                this.results = searched_meals
            }
        },
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
</style>
