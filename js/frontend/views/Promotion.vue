<template>
    <v-container class="mt-5 mb-10 px-3">
        <span style="color: white" class="title">Promotion Results</span>
        <v-row>
            <v-col cols="6" md="2">
                <meal
                    v-if="meal"
                    :meal="meal"
                    @showDescription="showDescription"
                ></meal>
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
    name: 'Promotion',
    components: { DescriptionDialog, Meal },
    mixins: [description_dialog],
    props: {
        originalMeal: {
            type: Object,
            default: () => null,
        },
    },
    data: () => ({
        meal: null,
    }),
    computed: {
        ...mapGetters(['categories', 'cart']),
    },
    watch: {
        $route: 'fetchData',
    },
    created() {
        if (!this.originalMeal) this.$router.push({ name: 'categories' })
        this.fetchData()
    },
    methods: {
        async fetchData() {
            if (this.originalMeal) {
                let categories = this.categories
                let cat_id = this.originalMeal.category_id
                let meal_id = this.originalMeal.id
                let searched_meals = null
                Object.keys(categories).forEach(function (id) {
                    if (categories[id].id === cat_id) {
                        let val = categories[id]
                        Object.keys(val.meals).forEach(function (id) {
                            if (val.meals[id].id === meal_id) {
                                searched_meals = val.meals[id]
                            }
                        })
                    }
                })
                this.meal = searched_meals
            }
        },
    },
}
</script>

<style scoped></style>
