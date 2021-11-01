export default {
    data() {
        return {
            locale: this.$app.locale,
        }
    },
    methods: {
        dataLoadProvider(ctx) {
            window.scrollTo(0, 0)
            return this.$refs.datasource.loadData(ctx.sortBy, ctx.sortDesc)
        },
        onContextChanged() {
            return this.$refs.datatable.refresh()
        },
        onContextChangedWithPage() {
            this.$refs.datasource.currentPage = 1
            this.onContextChanged()
        },
        onDelete(id) {
            this.$refs.datasource.deleteRow({ [this.item_type]: id })
        },
    },
}
