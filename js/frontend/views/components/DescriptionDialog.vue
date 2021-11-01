<template>
    <v-dialog max-width="290" v-model="activated.activator">
        <v-card
            class="d-flex"
            max-width="300"
            style="
                background-color: #040404;
                border: 1.5px solid #961b1e !important;
                border-radius: 16px;
                padding: 12px;
            "
        >
            <div
                style="
                    color: white;
                    font-size: 15px !important;
                    width: 100% !important;
                "
            >
                {{ description }}
                <br />
                <span style="color: white; font-size: 12px !important">
                    Note: For Add ons please check Add ons category
                </span>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'DescriptionDialog',
    props: {
        description: {
            type: String,
            default: '',
        },
        activated: {
            type: Object,
            default: () => null,
        },
    },
}
</script>

<style scoped></style>
