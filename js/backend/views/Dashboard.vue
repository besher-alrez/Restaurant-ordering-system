<template>
    <div>
        <b-row v-if="data">
            <b-col xl="4" lg="6" v-if="$app.user.can('view categories')">
                <router-link to="categories">
                    <b-card
                        class="summary"
                        bg-variant="primary"
                        text-variant="white"
                    >
                        <div class="d-flex align-items-center">
                            <span class="stamp stamp-md mr-3">
                                <font-awesome-icon
                                    icon="tags"
                                    class="float-right"
                                    size="2x"
                                ></font-awesome-icon>
                            </span>
                            <div>
                                <h4 class="m-0">
                                    {{ data.categoriesCount }}
                                    <small>Categories</small>
                                </h4>
                            </div>
                        </div>
                    </b-card>
                </router-link>
            </b-col>
            <b-col xl="4" lg="6" v-if="$app.user.can('view meals')">
                <router-link to="meals">
                    <b-card
                        class="summary"
                        bg-variant="success"
                        text-variant="white"
                    >
                        <b-btn
                            @click.prevent
                            v-b-toggle.meals-info
                            variant="transparent"
                            class="float-right info-button"
                            ><font-awesome-icon icon="info"></font-awesome-icon
                        ></b-btn>
                        <div class="d-flex align-items-center">
                            <span class="stamp stamp-md mr-3">
                                <font-awesome-icon
                                    icon="hamburger"
                                    class="float-right"
                                    size="2x"
                                ></font-awesome-icon>
                            </span>
                            <div>
                                <h4 class="m-0">
                                    {{ data.mealsCount.All }}
                                    <small>Meals</small>
                                </h4>
                            </div>
                        </div>
                        <b-collapse id="meals-info" accordion="meals-info">
                            <b-card-body>
                                <b-list-group>
                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Available
                                        <b-badge variant="primary" pill>{{
                                            data.mealsCount.Available
                                        }}</b-badge>
                                    </b-list-group-item>

                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Sold Out
                                        <b-badge variant="primary" pill>{{
                                            data.mealsCount.SoldOut
                                        }}</b-badge>
                                    </b-list-group-item>
                                </b-list-group>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                </router-link>
            </b-col>
            <b-col xl="4" lg="6" v-if="$app.user.can('view promotions')">
                <router-link to="promotions">
                    <b-card
                        class="summary"
                        bg-variant="blue"
                        text-variant="white"
                    >
                        <b-btn
                            @click.prevent
                            v-b-toggle.promotions-info
                            variant="transparent"
                            class="float-right info-button"
                            ><font-awesome-icon icon="info"></font-awesome-icon
                        ></b-btn>
                        <div class="d-flex align-items-center">
                            <span class="stamp stamp-md mr-3">
                                <font-awesome-icon
                                    icon="ad"
                                    class="float-right"
                                    size="2x"
                                ></font-awesome-icon>
                            </span>
                            <div>
                                <h4 class="m-0">
                                    {{ data.promotionsCount.All }}
                                    <small>Promotions</small>
                                </h4>
                            </div>
                        </div>
                        <b-collapse
                            id="promotions-info"
                            accordion="promotions-info"
                        >
                            <b-card-body>
                                <b-list-group>
                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        On
                                        <b-badge variant="primary" pill>{{
                                            data.promotionsCount.On
                                        }}</b-badge>
                                    </b-list-group-item>

                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Off
                                        <b-badge variant="primary" pill>{{
                                            data.promotionsCount.Off
                                        }}</b-badge>
                                    </b-list-group-item>
                                </b-list-group>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                </router-link>
            </b-col>
            <b-col xl="4" lg="6" v-if="$app.user.can('view tables')">
                <router-link to="tables">
                    <b-card
                        class="summary"
                        bg-variant="purple"
                        text-variant="white"
                    >
                        <b-btn
                            @click.prevent
                            v-b-toggle.tables-info
                            variant="transparent"
                            class="float-right info-button"
                            ><font-awesome-icon icon="info"></font-awesome-icon
                        ></b-btn>
                        <div class="d-flex align-items-center">
                            <span class="stamp stamp-md mr-3">
                                <font-awesome-icon
                                    icon="utensils"
                                    class="float-right"
                                    size="2x"
                                ></font-awesome-icon>
                            </span>
                            <div>
                                <h4 class="m-0">
                                    {{ data.tablesCount.All }}
                                    <small>Tables</small>
                                </h4>
                            </div>
                        </div>
                        <b-collapse id="tables-info" accordion="tables-info">
                            <b-card-body>
                                <b-list-group>
                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Available
                                        <b-badge variant="primary" pill>{{
                                            data.tablesCount.Available
                                        }}</b-badge>
                                    </b-list-group-item>

                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Reserved
                                        <b-badge variant="primary" pill>{{
                                            data.tablesCount.Reserved
                                        }}</b-badge>
                                    </b-list-group-item>
                                </b-list-group>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                </router-link>
            </b-col>
            <b-col xl="4" lg="6" v-if="$app.user.can('view orders')">
                <router-link to="orders">
                    <b-card
                        class="summary"
                        bg-variant="yellow"
                        text-variant="white"
                    >
                        <b-btn
                            @click.prevent
                            v-b-toggle.orders-info
                            variant="transparent"
                            class="float-right info-button"
                            ><font-awesome-icon icon="info"></font-awesome-icon
                        ></b-btn>
                        <div class="d-flex align-items-center">
                            <span class="stamp stamp-md mr-3">
                                <font-awesome-icon
                                    icon="receipt"
                                    class="float-right"
                                    size="2x"
                                ></font-awesome-icon>
                            </span>
                            <div>
                                <h4 class="m-0">
                                    {{ data.ordersCount.All }}
                                    <small>Orders</small>
                                </h4>
                            </div>
                        </div>
                        <b-collapse id="orders-info" accordion="orders-info">
                            <b-card-body>
                                <b-list-group>
                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Today
                                        <b-badge variant="primary" pill>{{
                                            data.ordersCount.All_Today
                                        }}</b-badge>
                                    </b-list-group-item>

                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Closed
                                        <b-badge variant="primary" pill>{{
                                            data.ordersCount.Closed
                                        }}</b-badge>
                                    </b-list-group-item>

                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Open
                                        <b-badge variant="primary" pill>{{
                                            data.ordersCount.Open
                                        }}</b-badge>
                                    </b-list-group-item>

                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Take Away
                                        <b-badge variant="primary" pill>{{
                                            data.ordersCount.take_away
                                        }}</b-badge>
                                    </b-list-group-item>

                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Dine In
                                        <b-badge variant="primary" pill>{{
                                            data.ordersCount.dine_in
                                        }}</b-badge>
                                    </b-list-group-item>
                                </b-list-group>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                </router-link>
            </b-col>
            <b-col xl="4" lg="6" v-if="$app.user.can('view alerts')">
                <router-link to="alerts">
                    <b-card
                        class="summary"
                        bg-variant="gray"
                        text-variant="white"
                    >
                        <b-btn
                            @click.prevent
                            v-b-toggle.alerts-info
                            variant="transparent"
                            class="float-right info-button"
                            ><font-awesome-icon icon="info"></font-awesome-icon
                        ></b-btn>
                        <div class="d-flex align-items-center">
                            <span class="stamp stamp-md mr-3">
                                <font-awesome-icon
                                    icon="bell"
                                    class="float-right"
                                    size="2x"
                                ></font-awesome-icon>
                            </span>
                            <div>
                                <h4 class="m-0">
                                    {{ data.alertsCount.All }}
                                    <small>Alerts</small>
                                </h4>
                            </div>
                        </div>
                        <b-collapse id="alerts-info" accordion="alerts-info">
                            <b-card-body>
                                <b-list-group>
                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Today
                                        <b-badge variant="primary" pill>{{
                                            data.alertsCount.All_Today
                                        }}</b-badge>
                                    </b-list-group-item>

                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Help
                                        <b-badge variant="primary" pill>{{
                                            data.alertsCount.Help
                                        }}</b-badge>
                                    </b-list-group-item>

                                    <b-list-group-item
                                        variant="light"
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        Bill
                                        <b-badge variant="primary" pill>{{
                                            data.alertsCount.Bill
                                        }}</b-badge>
                                    </b-list-group-item>
                                </b-list-group>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                </router-link>
            </b-col>
        </b-row>
        <b-row>
            <b-col xl="12" v-if="$app.user.can('view TRPB chart')">
                <b-card footer-class="d-block d-xl-none">
                    <template slot="header">
                        <span class="h5">
                            {{ $t('labels.backend.reports.titles.trpb') }}
                        </span>
                        <div class="card-header-actions">
                            <b-btn
                                variant="primary"
                                size="sm"
                                v-b-tooltip.hover
                                :title="$t('buttons.refresh')"
                                @click="$refs.trpb_chart.getData()"
                            >
                                <font-awesome-icon
                                    icon="sync-alt"
                                ></font-awesome-icon>
                            </b-btn>
                        </div>
                    </template>

                    <div class="trpb" ref="trpb_scroll">
                        <div
                            class="chart-wrapper"
                            :style="{
                                width: '1000px',
                                'min-width': '900px',
                                height: '300px',
                            }"
                        >
                            <total-revenue-per-branch
                                ref="trpb_chart"
                                style="height: 300px"
                                @loading="dtrpb_loaded = false"
                                @loaded="dtrpb_loaded = true"
                            ></total-revenue-per-branch>
                            <atom-spinner
                                :animation-duration="1000"
                                :size="200"
                                :color="'#97191D'"
                                :loading="!dtrpb_loaded"
                                :full="true"
                            ></atom-spinner>
                        </div>
                    </div>
                    <div slot="footer" class="d-flex justify-content-between">
                        <b-btn
                            class="rounded-circle"
                            variant="primary"
                            @click="scrollLeft(-100)"
                        >
                            <font-awesome-icon
                                icon="chevron-left"
                                size="lg"
                            ></font-awesome-icon>
                        </b-btn>
                        <b-btn
                            class="rounded-circle"
                            variant="primary"
                            @click="scrollLeft(100)"
                        >
                            <font-awesome-icon
                                icon="chevron-right"
                                size="lg"
                            ></font-awesome-icon>
                        </b-btn>
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios'
import TotalRevenuePerBranch from './charts/TotalRevenuePerBranch'
import AtomSpinner from '../components/Plugins/AtomSpinner'

export default {
    name: 'Dashboard',
    components: { AtomSpinner, TotalRevenuePerBranch },
    data() {
        return {
            data: null,
            dtrpb_loaded: true,
        }
    },
    async created() {
        let { data } = await axios.get(this.$app.route('ajax.get_counts'))
        this.data = data
    },
    mounted() {
        if (this.$refs.trpb_scroll) this.$refs.trpb_scroll.scrollLeft = 0
    },
    methods: {
        scrollLeft(value) {
            this.$refs.trpb_scroll.scrollLeft += value
        },
    },
}
</script>

<style scoped>
a {
    text-decoration: none !important;
}
.info-button {
    position: absolute;
    right: 0;
    top: 0;
}
.card.summary {
    position: relative;
    border-top-width: 0 !important;
}
.btn:focus,
.btn.focus {
    box-shadow: unset !important;
}
.trpb {
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
}
</style>
