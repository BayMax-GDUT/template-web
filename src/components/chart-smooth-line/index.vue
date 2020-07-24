<template>
    <div id="smoothLine" style="height: 350px;"></div>
</template>

<script>
export default {
    name: 'index',
    mounted () {
        let dom = document.getElementById('smoothLine')
        let myChart = this.$echarts.init(dom)
        if (this.option && typeof this.option === 'object') {
            myChart.setOption(this.option, true)
        }
    },
    props: {
        option: Object
    }
}
</script>

<style scoped>

</style>
