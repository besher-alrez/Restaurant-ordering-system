export default {
    data() {
        return {
            activator: { activator: false },
            description: null,
        }
    },
    methods: {
        showDescription(desc) {
            this.description = desc
            this.activator.activator = true
        },
    },
}
