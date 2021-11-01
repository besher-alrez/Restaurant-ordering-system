<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-app
        id="inspire"
        style="background-color: #040404; background-blend-mode: lighten"
    >
        <v-app-bar app color="#040404">
            <v-btn icon @click="$router.go(-1)" v-if="$route.name != 'welcome'">
                <v-icon color="#961b1e">mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-responsive
                max-width="200"
                v-if="
                    ((order_details && order_details.type) || order_type) &&
                    $route.name != 'welcome'
                "
            >
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    dense
                    flat
                    hide-details
                    rounded
                    v-debounce:2s="goToSearch"
                    :debounce-events="'input'"
                    style="
                        background-color: #040404;
                        width: 120px;
                        border: 1.5px solid #961b1e !important;
                        border-radius: 20px;
                    "
                    class="search-input"
                    append-icon="mdi-magnify"
                ></v-text-field>
            </v-responsive>
            <v-btn icon :to="cart_length ? 'checkout' : ''">
                <v-badge
                    color="grey"
                    :content="cart_length"
                    v-if="cart_length"
                    overlap
                    class="font-weight-black"
                >
                    <v-icon color="#0fac03">mdi-cart-outline</v-icon>
                </v-badge>
            </v-btn>
            <!--            <v-btn icon @click="dialog = false">-->
            <!--                <v-icon>mdi-bell</v-icon>-->
            <!--            </v-btn>-->
            <v-menu
                v-if="order_details"
                :close-on-content-click="true"
                :nudge-width="250"
                offset-y
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="refreshOrderInfo"
                    >
                        <v-icon color="#961b1e">mdi-food</v-icon>
                    </v-btn>
                </template>
                <div>
                    <v-card
                        class="bck"
                        style="
                            margin-top: 5px;
                            border: 1.5px solid #961b1e !important;
                            border-radius: 5px;
                        "
                    >
                        <v-card-title class="bck" style="font-size: medium">
                            <span>Your Order</span>
                        </v-card-title>
                        <v-card-title
                            style="
                                position: absolute;
                                top: 0.5px;
                                right: 5px;
                                font-size: medium;
                            "
                        >
                            <span>Table No:{{ order_details.table_id }}</span>
                        </v-card-title>
                        <br />
                        <v-virtual-scroll
                            :bench="0"
                            :items="order_details.items"
                            height="300"
                            item-height="64"
                        >
                            <template v-slot:default="{ item }">
                                <v-list-item :key="item.id" class="bck">
                                    <p style="font-size: small">
                                        {{ item.meal.name }}

                                        <v-chip
                                            class="ma-2 position-absolute"
                                            color="#040404"
                                            style="
                                                position: absolute;
                                                top: -5px;
                                                right: 1px;
                                                border: 1.5px solid #961b1e !important;
                                                border-radius: 16px;
                                            "
                                        >
                                            <span style="font-size: small"
                                                >RM {{ item.meal.price }} x
                                                {{ item.quantity }}</span
                                            >
                                        </v-chip>
                                    </p>
                                </v-list-item>
                            </template>
                        </v-virtual-scroll>
                        <v-list class="bck">
                            >
                            <v-list-item>
                                <p>
                                    Order Type:
                                    <span
                                        class="ma-2 position-absolute"
                                        style="
                                            position: absolute;
                                            top: -6px;
                                            right: 10px;
                                            color: #961b1e;
                                        "
                                        >{{
                                            order_details.type === 'dine_in'
                                                ? 'Dine In'
                                                : 'Take away'
                                        }}</span
                                    >
                                </p>
                            </v-list-item>
                            <v-list-item>
                                <p>
                                    Total:
                                    <span
                                        class="ma-2 position-absolute"
                                        style="
                                            position: absolute;
                                            top: -5px;
                                            right: 10px;
                                            color: #961b1e;
                                        "
                                        >{{ order_details.amount }}</span
                                    >
                                </p>
                            </v-list-item>
                            <!--<v-list-item v-if="settings && settings.SST">-->
                            <!--<p>-->
                            <!--SST:-->
                            <!--<span-->
                            <!--class="ma-2 position-absolute"-->
                            <!--style="-->
                            <!--position: absolute;-->
                            <!--top: -5px;-->
                            <!--right: 10px;-->
                            <!--color: #961b1e;-->
                            <!--"-->
                            <!--&gt;{{ bill_total }}</span-->
                            <!--&gt;-->
                            <!--</p>-->
                            <!--</v-list-item>-->
                        </v-list>
                    </v-card>
                </div>
            </v-menu>
            <v-menu offset-y :nudge-width="200">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon color="#961b1e">mdi-phone</v-icon>
                    </v-btn>
                </template>
                <v-list
                    class="bck"
                    style="
                        border: 1.5px solid #961b1e !important;
                        border-radius: 2%;
                    "
                >
                    <v-list-item>
                        <v-list-item-title
                            ><v-btn
                                style="margin-left: 115px"
                                @click="send_notification('help')"
                                icon
                                ><span>Get an assist&nbsp;</span>
                                <v-icon color="#961b1e"
                                    >mdi-account-alert</v-icon
                                >
                            </v-btn></v-list-item-title
                        >
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title
                            ><v-btn
                                style="margin-left: 90px"
                                @click="send_notification('bill')"
                                icon
                                ><span>Request your Bill&nbsp;</span>
                                <v-icon color="#961b1e"
                                    >mdi-chart-timeline</v-icon
                                >
                            </v-btn></v-list-item-title
                        >
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>
        <v-main class="lighten-2">
            <router-view :key="$route.name"></router-view>
        </v-main>
        <v-snackbar v-model="success_call" multi-line>
            <span style="color: #2a623d">{{ text }}</span>

            <template v-slot:action="{ attrs }">
                <v-btn
                    color="red"
                    text
                    v-bind="attrs"
                    @click="success_call = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
    name: 'Full',
    data: () => ({
        search: null,
        success_call: false,
        text: 'Request is placed',
        original_text: 'Request is placed',
    }),
    computed: {
        ...mapGetters([
            'cart',
            'order_details',
            'table_info',
            'promotions',
            'order_type',
            'settings',
        ]),
        cart_length() {
            return Object.values(this.cart).reduce(
                (total, { amount }) => total + amount,
                0
            )
        },
        bill_total() {
            return (
                parseFloat(this.order_details.amount) +
                (parseFloat(this.order_details.amount) *
                    parseFloat(this.settings.SST)) /
                    100
            )
        },
    },
    async created() {
        let branch_id = this.table_info.branch.id
        await this.$store.dispatch('GET_CATEGORIES', {
            branch_id: branch_id,
        })
        await this.$store.dispatch('GET_PROMOTIONS', {
            branch_id: branch_id,
        })
        await this.$store.dispatch('GET_SETTINGS')
    },
    methods: {
        goToSearch(value) {
            this.$router.push({
                name: 'search',
                params: { keyword: value },
            })
            this.search = null
        },
        async send_notification(type) {
            try {
                let { data } = await axios.post(
                    `/api/web/table/${this.table_info.guid}/alert`,
                    {
                        type: type,
                    }
                )
                this.showAlert()
            } catch (error) {
                if (error.response.status === 500) {
                    this.showAlert('Request already sent!')
                }
            }
        },
        refreshOrderInfo() {
            this.$store.dispatch('GET_ORDER', {
                table_id: this.table_info.guid,
            })
        },
        showAlert(msg = null) {
            if (msg !== null) this.text = msg
            else this.text = this.original_text
            this.success_call = true
            let timer = this.showAlert.timer
            if (timer) {
                clearTimeout(timer)
            }
            this.showAlert.timer = setTimeout(() => {
                this.success_call = false
                //this.$router.push('Welcome')
            }, 30000)
        },
    },
}
</script>
<style>
p,
span {
    color: white;
}
.bck {
    background-color: #040404 !important;
    font-weight: bold;
    font-size: medium;
}
.search-input i.primary--text {
    color: #961b1e !important;
    caret-color: #961b1e !important;
}

.v-input__icon--append .v-icon {
    color: #961b1e !important;
    margin-bottom: 4px !important;
    margin-left: 25px !important;
}
</style>
