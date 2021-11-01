<template>
    <div class="animated fadeIn">
        <form @submit.prevent="onSubmit">
            <b-row class="justify-content-center">
                <b-col xl="12">
                    <b-card>
                        <template slot="header" class="card-header">
                            <b-row>
                                <b-col sm="12" :md="popup ? 12 : 6">
                                    <span class="h3">
                                        {{
                                            isNew
                                                ? $t(
                                                      'labels.backend.orders.titles.create'
                                                  )
                                                : $t(
                                                      'labels.backend.orders.titles.edit'
                                                  )
                                        }}
                                    </span>
                                </b-col>
                                <b-col
                                    sm="12"
                                    :md="popup ? 12 : 6"
                                    class="card-header-actions"
                                >
                                    <b-row>
                                        <b-col sm="12" md="6">
                                            <b-form-group
                                                label-class="font-weight-bold"
                                                label-for="type"
                                                :invalid-feedback="
                                                    feedback('type')
                                                "
                                                :state="state('type')"
                                            >
                                                <b-form-radio-group
                                                    id="btn-radios-1"
                                                    v-model="model.type"
                                                    :options="types"
                                                    buttons
                                                    button-variant="outline-primary"
                                                    name="radios-btn-default"
                                                    size="sm"
                                                    :state="state('type')"
                                                    v-if="!readOnly"
                                                ></b-form-radio-group>
                                                <h4 v-else>
                                                    <b-badge
                                                        variant="info"
                                                        v-if="
                                                            model.type !== null
                                                        "
                                                    >
                                                        {{
                                                            types.find(
                                                                (o) =>
                                                                    o.value ===
                                                                    model.type
                                                            ).text
                                                        }}
                                                    </b-badge>
                                                </h4>
                                            </b-form-group>
                                        </b-col>
                                        <b-col sm="12" md="6">
                                            <b-form-group
                                                label-class="font-weight-bold"
                                                label-for="table"
                                                :invalid-feedback="
                                                    feedback('table')
                                                "
                                                :state="state('table')"
                                            >
                                                <multiselect
                                                    v-model="model.table"
                                                    :options="tables"
                                                    id="table"
                                                    name="table"
                                                    track-by="id"
                                                    label="name"
                                                    :searchable="true"
                                                    :close-on-select="true"
                                                    :show-labels="false"
                                                    :disabled="readOnly"
                                                    :placeholder="
                                                        '-- ' +
                                                        $t(
                                                            'validation.attributes.table'
                                                        ) +
                                                        ' --'
                                                    "
                                                    :state="state('table')"
                                                ></multiselect>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                </b-col>
                            </b-row>
                        </template>
                        <b-row class="justify-content-center">
                            <b-col :xl="12">
                                <b-card>
                                    <template slot="header" class="card-header">
                                        <span class="h3">
                                            {{
                                                $t(
                                                    'labels.backend.orders.titles.meals'
                                                )
                                            }}
                                        </span>
                                        <div class="card-header-actions">
                                            <b-btn
                                                size="sm"
                                                variant="primary"
                                                v-b-tooltip.hover
                                                :title="$t('buttons.add_more')"
                                                @click="add()"
                                                v-if="!readOnly"
                                            >
                                                <font-awesome-icon
                                                    icon="plus"
                                                ></font-awesome-icon>
                                            </b-btn>
                                        </div>
                                    </template>
                                    <template v-if="popup">
                                        <Batch
                                            v-for="(batch, i) in model.batches"
                                            :batch="batch"
                                            :key="i"
                                            @done="mark_as_done(batch)"
                                        ></Batch>
                                    </template>
                                    <list-of-components
                                        v-else
                                        :key="index"
                                        component-name="OrderItem"
                                        v-for="(batch, index) in model.batches"
                                        :items="batch.items"
                                        :label="
                                            $t(
                                                'validation.attributes.batch_meals',
                                                { id: batch.sort }
                                            )
                                        "
                                        :list-name="`batches.${index}.items`"
                                        :feedback="feedback"
                                        :state="state"
                                        :sample="{
                                            meal: null,
                                            quantity: 1,
                                        }"
                                        :additional-classes="batch.type"
                                        :component-props="{
                                            'selected-values': batch.items,
                                            'batch-id': index,
                                            disabled: readOnly,
                                        }"
                                        @list_deleted="deleteList"
                                        :disabled="
                                            batch.status === 'done' || readOnly
                                        "
                                    >
                                        <template slot="header_actions">
                                            <b-form-group
                                                class="float-left mr-3"
                                                label-class="font-weight-bold"
                                                :label-for="`batch.${index}.type`"
                                                :invalid-feedback="
                                                    feedback(
                                                        `batches.${index}.type`
                                                    )
                                                "
                                                :state="
                                                    state(
                                                        `batches.${index}.type`
                                                    )
                                                "
                                            >
                                                <b-form-radio-group
                                                    :id="`batch.${index}.type`"
                                                    v-model="batch.type"
                                                    :options="types"
                                                    buttons
                                                    button-variant="outline-primary"
                                                    name="radios-btn-default"
                                                    size="sm"
                                                    :state="
                                                        state(
                                                            `batches.${index}.type`
                                                        )
                                                    "
                                                    v-if="
                                                        batch.status ===
                                                            'pending' &&
                                                        !readOnly
                                                    "
                                                ></b-form-radio-group>
                                                <h4 v-else>
                                                    <b-badge
                                                        variant="info"
                                                        v-if="
                                                            batch.type !== null
                                                        "
                                                    >
                                                        {{
                                                            types.find(
                                                                (o) =>
                                                                    o.value ===
                                                                    batch.type
                                                            ).text
                                                        }}
                                                    </b-badge>
                                                </h4>
                                            </b-form-group>

                                            <b-badge
                                                :variant="
                                                    batch.status === 'pending'
                                                        ? 'warning'
                                                        : 'success'
                                                "
                                            >
                                                <span class="h5">{{
                                                    batch.status
                                                }}</span>
                                            </b-badge>
                                        </template>
                                        <h5
                                            slot="additional-info"
                                            class="font-weight-bolder"
                                        >
                                            Note: {{ batch.note }}
                                        </h5>
                                        <b-btn
                                            slot="actions"
                                            size="sm"
                                            variant="success"
                                            v-b-tooltip.hover
                                            :title="$t('buttons.mark_as_done')"
                                            @click="mark_as_done(batch)"
                                            v-if="batch.status === 'pending'"
                                        >
                                            <font-awesome-icon
                                                icon="check"
                                            ></font-awesome-icon>
                                        </b-btn>
                                    </list-of-components>
                                    <div>
                                        <b-badge>
                                            <h3>
                                                Total amount: {{ order_cost }}
                                            </h3>
                                        </b-badge>
                                    </div>
                                </b-card>
                            </b-col>
                        </b-row>

                        <b-row slot="footer" v-if="!popup">
                            <b-col>
                                <b-btn to="/orders" variant="danger" size="sm">
                                    {{ $t('buttons.back') }}
                                </b-btn>
                            </b-col>
                            <b-col v-if="!readOnly">
                                <b-btn
                                    type="submit"
                                    variant="success"
                                    size="sm"
                                    class="float-right"
                                    :disabled="pending"
                                    v-if="
                                        (isNew &&
                                            this.$app.user.can(
                                                'create orders'
                                            )) ||
                                        this.$app.user.can('edit orders')
                                    "
                                >
                                    {{
                                        isNew
                                            ? $t('buttons.create')
                                            : $t('buttons.edit')
                                    }}
                                </b-btn>
                            </b-col>
                        </b-row>
                    </b-card>
                    <atom-spinner
                        :animation-duration="1000"
                        :size="400"
                        :color="'#97191D'"
                        :loading="loading"
                        :full="true"
                    ></atom-spinner>
                </b-col>
            </b-row>
        </form>
    </div>
</template>

<script>
import form from '../mixins/form'
import ListOfComponents from './components/ListOfComponents'
import axios from 'axios'
import Batch from './components/Batch'

export default {
    name: 'OrderForm',
    components: { Batch, ListOfComponents },
    mixins: [form],
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        popup: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            modelName: 'order',
            resourceRoute: 'orders',
            listPath: '/orders',
            tables: [],
            model: {
                table: null,
                type: null,
                status: null,
                batches: [],
            },
            types: [
                { text: 'Take Away', value: 'take_away' },
                { text: 'Dine In', value: 'dine_in' },
            ],
        }
    },
    computed: {
        order_cost() {
            let total_amount = 0
            this.model.batches.forEach((batch) => {
                let amount = batch.items.reduce((total, item) => {
                    return (
                        parseFloat(total) +
                        (item.meal ? item.meal.price * item.quantity : 0)
                    ).toFixed(2)
                }, 0)
                total_amount += parseFloat(amount)
            })
            return total_amount.toFixed(2)
        },
        readOnly() {
            return this.disabled || this.model.status === 'closed'
        },
    },
    async created() {
        await this.$store.dispatch('GET_MEALS')
        let { data } = await axios.get(this.$app.route(`tables.search`))
        this.tables = data.data.map((item) => {
            return {
                id: item.id,
                name: `${item.internal_id}@${item.branch_name}`,
            }
        })
    },
    methods: {
        add() {
            this.model.batches.unshift({
                type: null,
                note: null,
                sort: null,
                status: 'pending',
                items: [],
            })
        },
        deleteList(payload) {
            this.model.batches.splice(payload.id, 1)
        },
        async mark_as_done(batch) {
            let result = await window.swal.fire({
                title: this.$t('labels.are_you_sure_change_status'),
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$t('buttons.cancel'),
                confirmButtonColor: '#dd4b39',
                confirmButtonText: this.$t('buttons.yes'),
            })
            if (result.value) {
                try {
                    let { data } = await axios.put(
                        this.$app.route('orders.mark_batch_as_done', {
                            batch: batch.id,
                        })
                    )
                    batch.status = 'done'
                    this.$app.noty[data.status](data.message)
                } catch (e) {
                    this.$app.error(e)
                }
            }
        },
    },
}
</script>
