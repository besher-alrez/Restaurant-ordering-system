<template>
    <b-form-group
        :label="label"
        label-class="font-weight-bold"
        :label-for="field_name_id"
        :label-cols="cols"
        :invalid-feedback="feedback(fieldName)"
        :state="state(fieldName)"
        class="file-upload-group required"
    >
        <div v-if="photo_url || imagePath" class="preview">
            <img
                class="mr-2 mb-2 img-thumbnail"
                :src="photo_url ? photo_url : imagePath"
                alt=""
                @click="$refs.imagefile.click()"
            />
            <input
                style="display: none"
                type="file"
                :id="field_name_id"
                :name="field_name_id"
                :state="state(fieldName)"
                @change="onFileChange"
                ref="imagefile"
            />
        </div>

        <div class="media" v-else>
            <div class="media-body">
                <b-input-group>
                    <b-input-group-prepend v-if="deletable">
                        <b-btn
                            variant="danger"
                            @click="$emit('image_deleted')"
                            >{{ $t('buttons.delete') }}</b-btn
                        >
                    </b-input-group-prepend>
                    <b-form-file
                        :id="field_name_id"
                        :name="field_name_id"
                        :placeholder="$t('labels.no_file_chosen')"
                        v-model="value"
                        :state="state(fieldName)"
                        @change="onFileChange"
                    ></b-form-file>
                </b-input-group>

                <p class="form-text text-muted">
                    {{ $t('labels.descriptions.allowed_image_types') }}
                </p>
            </div>
        </div>
    </b-form-group>
</template>

<script>
export default {
    name: 'Photo',
    props: {
        cols: {
            type: Number,
            default: 3,
        },
        fieldName: {
            default: () => 'field',
            type: String,
            required: true,
        },
        label: {
            default: () => 'label',
            type: String,
            required: true,
        },
        imagePath: {
            default: () => '',
            type: String,
        },
        value: {
            default: null,
            type: File,
        },
        editable: {
            default: true,
            type: Boolean,
        },
        deletable: {
            default: false,
            type: Boolean,
        },
        validation: {
            default: () => null,
            type: Object,
        },
    },
    data() {
        return {
            photo_url: null,
        }
    },
    computed: {
        field_name_id() {
            return this.fieldName.replace('.', '_')
        },
    },
    methods: {
        onFileChange(e) {
            const file = e.target.files[0]
            this.photo_url = URL.createObjectURL(file)
            this.$emit('input', file)
        },
        feedback(name) {
            if (this.state(name) === false) {
                let v = this.validation
                    ? this.validation
                    : this.$parent.validation
                return v.errors[name][0]
            }
        },
        state(name) {
            let v = this.validation ? this.validation : this.$parent.validation
            return v.errors !== undefined && v.errors.hasOwnProperty(name)
                ? false
                : null
        },
    },
}
</script>

<style>
.preview {
    display: flex;
    justify-content: center;
    align-items: center;
}

.preview img {
    max-width: 100%;
}
</style>
