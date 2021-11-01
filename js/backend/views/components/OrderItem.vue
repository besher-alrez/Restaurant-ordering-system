<template>
    <b-row class="item pr-3">
        <b-btn
            class="close"
            size="sm"
            variant="danger"
            v-b-tooltip.hover
            :title="$t('buttons.delete')"
            @click="dropItem()"
            v-if="!disabled && !deletable"
        >
            <font-awesome-icon icon="times"></font-awesome-icon>
        </b-btn>
        <!--        <h5>-->
        <!--            <b-badge class="order-batch" variant="info">{{-->
        <!--                value.batch-->
        <!--            }}</b-badge>-->
        <!--        </h5>-->

        <b-col xl="8" lg="6" sm="12">
            <b-form-group
                :label-for="meal_field"
                :invalid-feedback="feedback(meal_field)"
                :state="state(meal_field)"
            >
                <multiselect
                    :id="meal_field"
                    deselect-label=""
                    deselect-group-label=""
                    select-label=""
                    selected-label=""
                    select-group-label=""
                    v-model="value.meal"
                    :options="available_options"
                    group-values="meals"
                    group-label="category"
                    :placeholder="$t('validation.attributes.meal')"
                    track-by="id"
                    label="name"
                    :disabled="disabled"
                    @open="increment()"
                    ><span slot="noResult">No Results!</span></multiselect
                >
            </b-form-group>
        </b-col>
        <b-col xl="4" lg="6" sm="12">
            <b-form-group
                :label-for="quantity_field"
                :invalid-feedback="feedback(quantity_field)"
            >
                <b-form-input
                    :id="quantity_field"
                    :name="quantity_field"
                    :placeholder="$t('validation.attributes.quantity')"
                    v-model="value.quantity"
                    :state="state(quantity_field)"
                    :disabled="disabled"
                    class="quantity_input"
                    @input="checkQuantity"
                ></b-form-input>
            </b-form-group>
        </b-col>
    </b-row>
</template>
<script>
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'

export default {
    name: 'OrderItem',
    components: { Multiselect },
    props: {
        value: {
            default: () => ({
                meal: null,
                quantity: 1,
            }),
            type: Object,
        },
        selectedValues: {
            default: () => [],
            type: Array,
        },
        batchId: {
            default: 0,
            type: Number,
        },
        index: {
            default: 0,
            type: Number,
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false,
        },
        deletable: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    data() {
        return {
            counter: 0,
        }
    },
    computed: {
        quantity_field: function () {
            return (
                'batches.' + this.batchId + '.items.' + this.index + '.quantity'
            )
        },
        meal_field: function () {
            return 'batches.' + this.batchId + '.items.' + this.index + '.meal'
        },
        ...mapGetters(['meals']),
        plucked_selected_values() {
            return this.selectedValues
                .map((o) => {
                    return o.meal ? o.meal.id : null
                })
                .filter(
                    (o) => o && (!this.value.meal || o !== this.value.meal.id)
                )
        },
        available_options: function () {
            return this.counter > 0
                ? this.meals.map((i) => {
                      return {
                          category: i.category,
                          // meals: i.meals.map((m) => {
                          //     m.$isDisabled = this.plucked_selected_values.includes(
                          //         m.id,
                          //         0
                          //     )
                          //     return m
                          // }),
                          meals: i.meals.filter((m) => {
                              return !this.plucked_selected_values.includes(
                                  m.id,
                                  0
                              )
                          }),
                      }
                  })
                : []
        },
    },
    methods: {
        feedback(name) {
            if (this.state(name) === false) {
                return this.$parent.$parent.validation.errors[name][0]
            }
        },
        state(name) {
            return this.$parent.$parent.validation.errors !== undefined &&
                this.$parent.$parent.validation.errors.hasOwnProperty(name)
                ? false
                : null
        },
        dropItem() {
            this.$emit('deleted', { index: this.index })
        },
        increment() {
            this.counter++
        },
        checkQuantity(newVal) {
            let result = String(newVal)
                // remove non numerical chars
                .replace(/\D/g, '')
                // remove any zeros in the beginning
                .replace(/^0/g, '')
            // this.value.quantity = result
            this.$nextTick(() => (this.value.quantity = result))
        },
    },
}
</script>
<style scoped>
.item {
    padding-top: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 3px;
    border: 1px solid #e9ecef;
    position: relative;
    width: 100%;
}
.take_away .item {
    background-color: #ffe8e8;
}
.dine_in .item {
    background-color: #93a7e3;
}
.order-batch {
    position: absolute;
    right: 0;
    top: 30px;
}
.quantity_input {
    border-radius: 0;
    min-height: 43px;
    border: 1px solid #c2cfd6 !important;
    font-size: 1.2rem !important;
    font-weight: bold !important;
}
/deep/ .multiselect__option--group {
    font-weight: 900;
    background: #97191d !important;
    color: black !important;
}
/deep/ .multiselect__option.multiselect__option--group {
    text-indent: 0 !important;
}
/deep/ .multiselect__option {
    text-indent: 5%;
}
/deep/ .multiselect__single {
    font-size: 1.2rem !important;
    font-weight: bold !important;
}
</style>
