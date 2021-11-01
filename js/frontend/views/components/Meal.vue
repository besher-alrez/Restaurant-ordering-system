<template>
    <v-card
        elevation="3"
        shaped
        :disabled="meal.sold_out"
        @click="addToCart(meal)"
        style="
            background-color: #040404;
            border: 1.5px solid #961b1e !important;
            border-radius: 20px;
            padding-bottom: 20px;
        "
    >
        <v-img
            lazy-src="/images/logo.png"
            :src="meal.image_path"
            height="200px"
        ></v-img>

        <v-card-title
            style="
                position: relative;
                color: white;
                font-size: 15px;
                word-break: normal;
            "
            >{{ meal.name }}
            <v-chip
                class="ma-2 position-absolute"
                color="#040404"
                style="
                    position: absolute;
                    top: -22px;
                    right: 10px;
                    border: 1.5px solid #961b1e !important;
                    border-radius: 16px;
                "
            >
                RM {{ meal.price }}
            </v-chip>
        </v-card-title>
        <v-icon
            size="22"
            @click.stop="$emit('showDescription', meal.description)"
            class="info-icon"
        >
            mdi-information-outline
        </v-icon>

        <v-overlay
            :opacity="0.9"
            :value="true"
            class="v-overlay__scrim"
            absolute
            :z-index="1"
            v-if="cart[meal.id] && cart[meal.id].amount > 0"
        >
            <v-text-field
                v-model="cart[meal.id].amount"
                readonly
                class="huge-input"
            >
                <v-icon
                    size="30"
                    slot="append"
                    color="green"
                    @click.stop="addToCart(meal)"
                    style="margin-top: 10px; margin-right: 10px"
                >
                    mdi-plus
                </v-icon>
                <v-icon
                    size="20"
                    slot="prepend"
                    color="red"
                    @click.stop="removeFromCart(meal)"
                    style="margin-top: 14px; margin-left: 10px"
                >
                    mdi-minus
                </v-icon>
            </v-text-field>
        </v-overlay>
        <v-overlay
            :opacity="0.9"
            :value="true"
            absolute
            :z-index="1"
            v-if="meal.sold_out"
            color="red"
            class="v-overlay__scrim"
        >
            <p
                style="margin-top: 14px; margin-left: 10px"
                class="font-weight-black black--text"
            >
                SOLD OUT
            </p>
        </v-overlay>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Meal',
    props: {
        meal: {
            type: Object,
            default: () => null,
        },
    },
    computed: {
        ...mapGetters(['cart']),
    },
    methods: {
        addToCart(meal) {
            if (meal.sold_out) return
            this.$store.dispatch('ADD_TO_CART', { meal: meal })
        },
        removeFromCart(meal) {
            this.$store.dispatch('REMOVE_FROM_CART', { meal: meal })
        },
    },
}
</script>

<style scoped></style>
