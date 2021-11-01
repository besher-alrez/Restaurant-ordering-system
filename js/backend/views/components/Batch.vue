<template>
    <b-list-group class="mb-3">
        <b-list-group-item
            href="#"
            :variant="batch.type === 'dine_in' ? 'danger' : 'info'"
            class="flex-column align-items-start"
        >
            <div class="d-flex w-100 justify-content-between">
                <h4 class="mb-1 font-weight-bold">
                    {{
                        $t('validation.attributes.batch_meals', {
                            id: batch.sort,
                        })
                    }}
                </h4>
                <div>
                    <b-badge
                        :variant="batch.type === 'dine_in' ? 'danger' : 'info'"
                        v-if="batch.type !== null"
                    >
                        <span class="h5">{{
                            types.find((o) => o.value === batch.type).text
                        }}</span>
                    </b-badge>

                    <b-badge
                        :variant="
                            batch.status === 'pending' ? 'warning' : 'success'
                        "
                    >
                        <span class="h5">{{ batch.status }}</span>
                    </b-badge>
                </div>
            </div>
        </b-list-group-item>
        <b-list-group-item
            href="#"
            class="d-flex justify-content-between align-items-center font-weight-bolder list-item"
            v-for="(item, index) in batch.items"
            :key="index"
        >
            {{ item.meal.name }}
            <b-badge variant="primary" pill
                ><span class="h5 font-weight-bolder">{{
                    item.quantity
                }}</span></b-badge
            >
        </b-list-group-item>
        <b-list-group-item
            class="list-item"
            variant="success"
            v-if="batch.note"
        >
            Note: {{ batch.note }}</b-list-group-item
        >
        <b-list-group-item v-if="batch.status === 'pending'" variant="success"
            ><b-btn block variant="success" @click="$emit('done', batch)">
                <font-awesome-icon icon="check"></font-awesome-icon>
                {{ $t('buttons.mark_as_done') }}</b-btn
            ></b-list-group-item
        >
    </b-list-group>
</template>

<script>
export default {
    name: 'Batch',
    props: {
        batch: {
            type: Object,
            default: () => null,
        },
    },
    data() {
        return {
            types: [
                { text: 'Take Away', value: 'take_away' },
                { text: 'Dine In', value: 'dine_in' },
            ],
        }
    },
}
</script>

<style scoped>
.list-item {
    font-size: 1.15rem !important;
}
</style>
