<script>
import { Line, mixins } from 'vue-chartjs'
import axios from 'axios'

const { reactiveData } = mixins

const all_colors = ['rgba(5, 47, 132, 0.6)', 'rgba(254, 180, 1, 0.6)']

export default {
    extends: Line,
    mixins: [reactiveData],
    props: {
        options: {
            type: Object,
            default: () => {
                return {
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        mode: 'point',
                        intersect: true,
                        callbacks: {
                            label: function (tooltipItem, data) {
                                let num = Number(
                                    tooltipItem.yLabel
                                ).toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'MYR',
                                })
                                return `${
                                    data.datasets[tooltipItem.datasetIndex]
                                        .label
                                }: ${num}`
                            },
                            labelColor: function (context) {
                                return {
                                    borderColor: `${
                                        all_colors[context.datasetIndex]
                                    }`,
                                    backgroundColor: `${
                                        all_colors[context.datasetIndex]
                                    }`,
                                }
                            },
                        },
                    },
                    scales: {
                        yAxes: [
                            {
                                offset: false,
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    precision: 0,
                                    suggestedMax: 10,
                                    callback: function (value, index, values) {
                                        // console.log(
                                        //     value,
                                        //     (value / 1000).toLocaleString(
                                        //         'en-US',
                                        //         {
                                        //             style: 'currency',
                                        //             currency: 'MYR',
                                        //         }
                                        //     ),
                                        //     value > 1000
                                        //         ? `MYR ${value / 1000}K`
                                        //         : `MYR ${value}`
                                        // )
                                        return value >= 1000
                                            ? `${value / 1000}K MYR `
                                            : `${value} MYR`
                                        //
                                        // value.toLocaleString('en-US', {
                                        //     style: 'currency',
                                        //     currency: 'MYR',
                                        // })
                                    },
                                },
                            },
                        ],
                        xAxes: [
                            {
                                // offset: true,
                                ticks: {
                                    autoSkip: true,
                                    maxTicksLimit: 6,
                                    beginAtZero: true,
                                    maxRotation: 0,
                                    minRotation: 0,
                                    callback: function (label) {
                                        return label.split(' ')
                                    },
                                },
                                gridLines: {
                                    display: false,
                                    drawBorder: false,
                                },
                            },
                        ],
                    },
                }
            },
        },
    },
    data() {
        return {
            colors: all_colors,
        }
    },
    created() {
        this.getData()
    },
    async mounted() {
        this.renderChart(this.chartData, this.options)
    },
    methods: {
        async getData() {
            try {
                this.$emit('loading')
                let { data } = await axios.get(
                    this.$app.route('reports.revenue_per_branch')
                )

                let datasets = []
                let colors = this.colors
                let i = 0

                let labels = []

                Object.keys(data).forEach(function (key) {
                    if (
                        Object.keys(Object.values(data[key])).length >
                        labels.length
                    ) {
                        labels = Object.keys(data[key])
                    }
                    datasets.push({
                        label: key,
                        // backgroundColor: colors[i++],
                        data: Object.values(data[key]),
                        borderColor: colors[i++],
                        fill: false,
                        // backgroundColor: '#26c53a',
                        barThickness: 7,
                    })
                })

                this.chartData = {
                    labels: labels,
                    datasets: datasets,
                }
                this.$emit('loaded')
            } catch (e) {
                this.$app.error(e)
            }
        },
    },
}
</script>
