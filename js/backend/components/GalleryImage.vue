<template>
    <b-row class="image pr-3" style="position: relative">
        <b-btn
            class="close"
            size="sm"
            variant="danger"
            v-b-tooltip.hover
            :title="$t('buttons.drop_image')"
            @click="dropImage()"
            v-if="!disabled"
        >
            <font-awesome-icon icon="times"></font-awesome-icon>
        </b-btn>

        <b-btn
            class="close mt-5 mr-1"
            size="md"
            variant="default"
            @click="value.collapse_status = !value.collapse_status"
            v-b-tooltip.hover
            :title="$t('buttons.expand')"
        >
            <font-awesome-icon icon="sort-down"></font-awesome-icon>
        </b-btn>

        <b-col xl="12">
            <b-form-group
                :label="$t('validation.attributes.images_info.file')"
                :label-cols="3"
                :invalid-feedback="feedback(image_file_field)"
                :state="state(image_file_field)"
                class="file-upload-group required"
            >
                <div v-if="photo_url || value.url" class="preview">
                    <img
                        class="mr-2 mb-2 img-thumbnail"
                        :src="photo_url ? photo_url : value.url"
                        alt=""
                        width="150px"
                        @click="$refs.imagefile.click()"
                    />
                    <input
                        style="display: none"
                        type="file"
                        :id="image_file_field"
                        :name="image_file_field"
                        :placeholder="$t('labels.no_file_chosen')"
                        :state="state(image_file_field)"
                        @change="onFileChange"
                        ref="imagefile"
                    />
                </div>

                <div class="media" v-if="!value.url || value.url">
                    <div class="media-body">
                        <b-form-file
                            :id="image_file_field"
                            :name="image_file_field"
                            :placeholder="$t('labels.no_file_chosen')"
                            v-model="value.file"
                            :state="state(image_file_field)"
                            @change="onFileChange"
                            :ref="compName + '-' + index"
                            v-if="!(photo_url || value.url)"
                        ></b-form-file>
                        <p class="form-text text-muted">
                            {{ $t('labels.descriptions.allowed_image_types') }}
                        </p>
                    </div>
                </div>
            </b-form-group>
        </b-col>
        <b-col xl="12">
            <b-collapse
                :id="`gallery_image_${index}`"
                v-model="value.collapse_status"
                class="mt-2"
                accordion="my-images"
            >
                <b-row>
                    <b-col xl="12">
                        <template v-for="(l, idx) in $app.available_locales">
                            <b-form-group
                                :key="`image_${idx}`"
                                :label="
                                    $t(
                                        'validation.attributes.images_info.title_locale',
                                        {
                                            locale: $t(
                                                `validation.attributes.${l}_locale`
                                            ),
                                        }
                                    )
                                "
                                :invalid-feedback="
                                    feedback(image_title_field(l))
                                "
                                :state="state(image_title_field(l))"
                                :label-cols="3"
                            >
                                <b-form-input
                                    :id="`image_${l}_title_${index}`"
                                    :name="`image_${l}_title`"
                                    :placeholder="
                                        $t(
                                            'validation.attributes.images_info.title_locale',
                                            {
                                                locale: $t(
                                                    `validation.attributes.${l}_locale`
                                                ),
                                            }
                                        )
                                    "
                                    v-model="value.title[l]"
                                    :state="state(image_title_field(l))"
                                    :plaintext="disabled"
                                ></b-form-input>
                            </b-form-group>
                        </template>
                    </b-col>
                </b-row>
            </b-collapse>
        </b-col>
    </b-row>
</template>
<script>
export default {
    name: 'GalleryImage',
    props: {
        value: {
            default: () => {},
            type: Object,
        },
        index: {
            default: 0,
            type: Number,
        },
        compName: {
            default: 'file',
            type: String,
            required: false,
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    data() {
        return {
            config: {
                wrap: true,
                allowInput: true,
            },
            photo_url: null,
        }
    },
    computed: {
        image_file_field: function () {
            return 'gallery_images.' + this.index + '.file'
        },
    },
    // created() {
    //     if (this.value.title === null) {
    //         this.value.title = {}
    //         this.$app.available_locales.forEach((locale) => {
    //             this.value.title[locale] = null
    //         })
    //     }
    // },
    methods: {
        image_title_field(locale) {
            return `gallery_images.${this.index}.${locale}_title`
        },
        updateInput: function () {
            this.$emit('input', {
                id: this.value.id,
                title: this.value.title,
                file: this.$refs[`${this.compName}-${this.index}`].$el
                    .firstChild.files.length
                    ? this.$refs[`${this.compName}-${this.index}`].$el
                          .firstChild.files[0]
                    : null,
                url: this.value.url,
                collapse_status: this.value.collapse_status,
            })
        },
        onFileChange(e) {
            const file = e.target.files[0]
            this.photo_url = URL.createObjectURL(file)
            this.$emit('input', {
                id: this.value.id,
                title: this.value.title,
                file: file,
                url: this.value.url,
                collapse_status: this.value.collapse_status,
            })
        },
        dropImage() {
            this.$emit('deleted', { index: this.index })
        },
        feedback(name) {
            if (this.state(name)) {
                return this.$parent.validation.errors[name][0]
            }
        },
        state(name) {
            return this.$parent.validation.errors !== undefined &&
                this.$parent.validation.errors.hasOwnProperty(name)
                ? 'invalid'
                : null
        },
    },
}
</script>

<style scoped>
.btn-group >>> .btn.active {
    z-index: 0 !important;
}
.is-invalid >>> .multiselect__tags {
    border-color: #f86c6b !important;
}
.is-invalid >>> .form-control {
    border-color: #f86c6b !important;
}
.image_link {
    width: 30%;
}
.image {
    background-color: #f0fffd;
    padding-top: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 3px;
    border: 1px solid #e9ecef;
}
.image:hover {
    background-color: #e4fffd;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
}
.close {
    position: absolute;
    right: 5px;
    top: 5px;
}
.img-thumbnail {
    width: 100%;
}
</style>
