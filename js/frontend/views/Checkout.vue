<template>
    <v-container class="mb-16">
        <v-list subheader color="black">
            <v-subheader><h2 style="color: white">Check out</h2></v-subheader>

            <template v-for="item in cart">
                <v-list-item v-if="item.amount > 0" :key="item.meal.id">
                    <v-list-item-avatar>
                        <v-img
                            :alt="`${item.meal.name} avatar`"
                            :src="item.meal.image_path"
                        ></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title
                            class="text-w"
                            v-text="item.meal.name"
                        ></v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-icon style="width: 30%">
                        <v-text-field
                            v-model="item.amount"
                            readonly
                            class="checkout text-input-white"
                        >
                            <v-icon
                                slot="append"
                                color="green"
                                @click.stop="
                                    $store.dispatch('ADD_TO_CART', {
                                        meal: item.meal,
                                    })
                                "
                            >
                                mdi-plus
                            </v-icon>
                            <v-icon
                                slot="prepend"
                                color="red"
                                @click.stop="
                                    $store.dispatch('REMOVE_FROM_CART', {
                                        meal: item.meal,
                                    })
                                "
                            >
                                mdi-minus
                            </v-icon>
                        </v-text-field>
                        <v-badge
                            style="right: 30px; margin-bottom: 2px"
                            color="black"
                            borderd
                            :content="
                                (item.meal.price * item.amount).toFixed(2)
                            "
                            overlap
                            class="font-weight-black"
                        >
                        </v-badge>
                    </v-list-item-icon>
                </v-list-item>
                <v-divider
                    :key="`divider-${item.meal.id}`"
                    :inset="item.inset"
                ></v-divider>
            </template>
            <v-list-item>
                <v-text-field
                    name="pw"
                    label="Password:"
                    v-model="password"
                    hint="Password"
                ></v-text-field>
                <v-dialog max-width="290">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="#040404"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            style="
                                max-width: 5px !important;
                                min-width: 5px !important;
                                padding: 0px !important;
                            "
                        >
                            <v-icon size="22" color="#961b1e">
                                mdi-information-outline
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-card
                        class="d-flex"
                        style="
                            background-color: #040404;
                            border: 1.5px solid #961b1e !important;
                            border-radius: 16px;
                        "
                    >
                        <div
                            style="
                                color: white;
                                font-size: 15px !important;
                                width: 100% !important;
                                padding: 12px;
                            "
                        >
                            Please ask the waiter help for the password
                        </div>
                    </v-card>
                </v-dialog>
            </v-list-item>
            <v-list-item>
                <v-textarea
                    name="Note"
                    label="Note:"
                    v-model="note"
                    hint="Write your note"
                ></v-textarea>
            </v-list-item>
            <v-list-item>
                <v-btn
                    block
                    color="#040404"
                    :disabled="totalCost === 0 || checking_out"
                    @click="sendOrder"
                    style="
                        border: 3px solid #2a623d !important;
                        border-radius: 10px !important;
                    "
                >
                    <span style="color: white"
                        >Check Out ({{ totalCost }} RM)</span
                    ></v-btn
                >
            </v-list-item>
        </v-list>
        <v-alert v-if="success_order" type="success"
            >Order is successfully placed</v-alert
        >
        <v-alert v-if="error_order" type="error">{{ error_order }}</v-alert>
        <v-dialog v-model="checking_out" fullscreen>
            <v-container
                fluid
                fill-height
                size="200"
                style="background-color: rgba(255, 255, 255, 0.1)"
            >
                <v-layout justify-center align-center>
                    <v-progress-circular indeterminate color="#961b1e">
                    </v-progress-circular>
                </v-layout>
            </v-container>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
    name: 'Checkout',
    data: () => ({
        note: null,
        password: null,
        meals: [],
        table_id: null,
        success_order: false,
        error_order: '',
        checking_out: false,
        batch_unique_id: null,
    }),
    computed: {
        ...mapGetters([
            'categories',
            'cart',
            'table_info',
            'order_type',
            'order_details',
        ]),
        totalCost() {
            return Object.values(this.cart).reduce(
                (total, item) =>
                    parseFloat(
                        (total + item.amount * item.meal.price).toFixed(2)
                    ),
                0
            )
        },
    },
    watch: {
        cart: {
            deep: true,
            handler(newVal) {
                if (
                    Object.values(newVal).length > 0 &&
                    Object.values(newVal).filter((i) => i.amount > 0).length ===
                        0
                ) {
                    this.$router.push({ name: 'categories' })
                }
            },
        },
    },
    mounted() {
        window.scrollTo(0, 0)
        this.table_id = this.$route.params.table_id
        let chars_list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        this.batch_unique_id = Array(36)
            .join()
            .split(',')
            .map(function () {
                return chars_list.charAt(
                    Math.floor(Math.random() * chars_list.length)
                )
            })
            .join('')
    },
    methods: {
        sendOrder() {
            this.checking_out = true
            let carts = this.cart
            let meals = []

            Object.keys(carts).forEach(function (key) {
                let val = carts[key]

                if (val.amount === 0) return
                meals.push({
                    id: val.meal.id,
                    quantity: val.amount,
                })
            })
            if (this.order_details) {
                let order_id = this.order_details.id
                axios
                    .post(
                        '/api/web/table/' +
                            this.table_id +
                            '/order/' +
                            order_id,
                        {
                            order_type: this.order_type,
                            note: this.note,
                            password: this.password,
                            meals: meals,
                            batch_unique_id: this.batch_unique_id,
                            _method: 'patch',
                        }
                    )
                    .then((response) => {
                        this.$store.commit('SET_ORDER_DETAILS', {
                            order_details: response.data,
                        })
                        this.order_successful()
                    })
                    .catch((error) => {
                        if (
                            error &&
                            error.response &&
                            error.response.status === 403
                        ) {
                            this.showError('Password is incorrect')
                        } else if (
                            error &&
                            error.response &&
                            error.response.data.message ===
                                'The selected table is not available'
                        ) {
                            this.showError('Table is reserved')
                        } else {
                            this.showError(
                                'Something is wrong, please try to check out again'
                            )
                        }
                        this.checking_out = false
                    })
                return
            }
            axios
                .post('/api/web/table/' + this.table_id + '/order', {
                    order_type: this.order_type,
                    note: this.note,
                    password: this.password,
                    meals: meals,
                    batch_unique_id: this.batch_unique_id,
                })
                .then((response) => {
                    this.$store.commit('SET_ORDER_DETAILS', {
                        order_details: response.data,
                    })
                    this.order_successful()
                })
                .catch((error) => {
                    if (
                        error &&
                        error.response &&
                        error.response.status === 403
                    ) {
                        this.showError('Password is incorrect')
                    } else if (
                        error &&
                        error.response &&
                        error.response.data.message ===
                            'The selected table is not available'
                    ) {
                        this.showError('Table is reserved')
                    } else {
                        this.showError(
                            'Something is wrong, please try to check out again'
                        )
                    }
                    this.checking_out = false
                })
        },
        async order_successful() {
            this.$store.commit('RESET_CART_ITEM')
            // alert('Order is successfully placed')
            this.showAlert()
        },
        showAlert() {
            this.success_order = true
            let timer = this.showAlert.timer
            if (timer) {
                clearTimeout(timer)
            }
            this.showAlert.timer = setTimeout(() => {
                this.success_order = false
                this.$router.push('Welcome')
            }, 5000)
        },
        showError(message) {
            this.error_order = message
            let timer = this.showAlert.timer
            if (timer) {
                clearTimeout(timer)
            }
            this.showAlert.timer = setTimeout(() => {
                this.error_order = ''
            }, 5000)
        },
    },
}
</script>

<style>
.checkout input {
    text-align: center;
}
.text-w {
    color: white !important;
}
button,
input,
optgroup,
select,
textarea {
    color: white !important;
}
.v-badge__badge {
    border: 2px solid #961b1e !important;
    /*border-radius: 10px !important;*/
    padding: 3px !important;
}

.v-label {
    color: white !important;
}
.v-input__slot:before {
    border-color: #961b1e !important;
}
.v-application .black {
    border-color: #961b1e !important;
}
</style>
