<template>
    <v-container class="mb-20">
        <div>
            <v-img
                src="/images/logo.png"
                width="40%"
                class="rounded-circle mx-auto"
            ></v-img>
        </div>
        <div class="my-auto text-center mt-5">
            <p
                class="pb-10"
                style="color: #c1bebf; width: 70%; margin-left: 50px"
            >
                With a quality and relaxing environment, we provide you food
                selected carefully from East to West to satisfy your craving,
                besides to our signature desserts to improve your mood.
                <br />
            </p>

            <div>
                <v-icon color="#961b1e">mdi-silverware</v-icon>
                <br />
                <p style="font-size: medium; color: white">
                    Table {{ table_info.internal_id }}
                </p>
            </div>
            <br />
            <v-card class="pb-5" color="#040404">
                <div>
                    <p
                        style="
                            font-size: medium;
                            color: white;
                            margin-bottom: 10px;
                        "
                    >
                        {{
                            order_details && order_details.id
                                ? 'ADD ITEM'
                                : 'Start Order'
                        }}
                    </p>
                </div>
                <v-row justify="space-around" color="#040404">
                    <v-col cols="6">
                        <v-sheet class="pa-2" color="#040404">
                            <v-btn
                                color="#040404"
                                fab
                                x-large
                                dark
                                @click="startOrder('dine_in')"
                            >
                                <v-icon color="#961b1e">mdi-table-chair</v-icon>
                                <span
                                    style="
                                        position: absolute;
                                        margin-top: 60px;
                                        color: white;
                                    "
                                >
                                    Dine In
                                </span>
                            </v-btn>
                        </v-sheet>
                    </v-col>
                    <v-col cols="6">
                        <v-sheet class="pa-2" color="#040404">
                            <v-btn
                                color="#040404"
                                fab
                                x-large
                                dark
                                @click="startOrder('take_away')"
                            >
                                <v-icon color="#961b1e">mdi-walk</v-icon>
                                <span
                                    style="
                                        position: absolute;
                                        margin-top: 60px;
                                        color: white;
                                    "
                                >
                                    Take Away
                                </span>
                            </v-btn>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-card>
        </div>
        <v-speed-dial
            v-model="fab"
            bottom
            right
            direction="top"
            transition="slide-y-reverse-transition"
            style="margin-bottom: 10px"
        >
            <template v-slot:activator>
                <v-btn v-model="fab" color="#961b1e" fab>
                    <v-icon v-if="fab"> mdi-close </v-icon>
                    <v-icon v-else> mdi-link </v-icon>
                </v-btn>
            </template>
            <v-btn
                v-for="(social, i) in socials"
                :key="i"
                :color="social.color"
                :href="social.link"
                target="_blank"
                fab
                icon
                large
            >
                <v-icon>{{ social.icon }}</v-icon>
            </v-btn>
        </v-speed-dial>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Welcome',
    data: () => ({
        fab: null,
        table_status: null,
        table_id: null,
        socials: [
            {
                icon: 'mdi-facebook',
                color: 'indigo',
                link: 'https://www.facebook.com/juliosrestoran',
            },
            {
                icon: 'mdi-instagram',
                color: 'red lighten-3',
                link: 'https://www.instagram.com/juliosgroup/',
            },
            // {
            //     icon: 'mdi-twitter',
            //     color: '#26c6da',
            //     link: '',
            // },
        ],
    }),
    computed: {
        ...mapGetters(['table_info', 'order_details']),
    },
    mounted() {
        this.table_id = this.$route.params.table_id
    },
    methods: {
        startOrder(type) {
            this.$store.dispatch('SET_ORDER_TYPE', type)
            this.$router.push({ name: 'categories' })
        },
    },
}
</script>

<style>
.v-speed-dial {
    position: absolute !important;
    z-index: 5 !important;
}
.mb-20 {
    margin-bottom: 80px !important;
}
</style>
