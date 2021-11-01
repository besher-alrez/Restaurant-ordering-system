<template>
    <fieldset :class="`list form-fieldset ${additionalClasses}`">
        <div class="mb-4">
            <span class="h3 font-weight-bold">
                {{ label }}
            </span>
            <div class="card-header-actions" style="margin-right: 1rem">
                <slot name="header_actions"></slot>
            </div>
        </div>
        <b-btn
            class="close"
            size="sm"
            variant="danger"
            v-b-tooltip.hover
            :title="$t('buttons.delete')"
            @click="$emit('list_deleted', { id: $vnode.key })"
            v-if="!disabled"
        >
            <font-awesome-icon icon="times"></font-awesome-icon>
        </b-btn>

        <b-form-group
            :invalid-feedback="feedback(listName)"
            :state="state(listName)"
        >
        </b-form-group>

        <template v-for="(item, index) in items">
            <component
                v-model="items[index]"
                :is="componentName"
                :index="index"
                :ref="listName + '-' + index"
                :key="index"
                v-bind="componentProps"
                @deleted="drop(index)"
                v-if="item.id === null || item.id !== 0"
            ></component>
        </template>

        <slot name="additional-info"> </slot>
        <div class="float-right">
            <slot name="actions"></slot>
            <b-btn
                v-if="!componentProps.disabled"
                size="sm"
                variant="primary"
                v-b-tooltip.hover
                :title="$t('buttons.add_more')"
                @click="add()"
            >
                <font-awesome-icon icon="plus"></font-awesome-icon>
            </b-btn>
        </div>
    </fieldset>
</template>

<script>
import components from './widgets'

export default {
    name: 'ListOfComponents',
    components,
    props: {
        componentName: {
            type: String,
            required: true,
        },
        componentProps: {
            type: Object,
            required: false,
            default: () => {},
        },
        items: {
            default: () => [],
            type: Array,
        },
        listName: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        sample: {
            type: [Object, Array],
            required: true,
        },
        state: {
            type: Function,
            required: true,
        },
        feedback: {
            type: Function,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        additionalClasses: {
            type: String,
            default: '',
        },
    },
    methods: {
        add() {
            // this.items.push(this.sample)
            let sample = JSON.parse(JSON.stringify(this.sample))
            this.items.push(sample)
        },
        drop(index) {
            this.items.splice(index, 1)
        },
    },
}
</script>

<style scoped>
.list {
    padding-top: 8px;
    margin-top: 5px;
    border-radius: 3px;
    position: relative;
}
</style>
