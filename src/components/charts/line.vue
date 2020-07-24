<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
  import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'

echarts.registerTheme('tdTheme', tdTheme)
export default {
    name: 'ChartLine',
    props: {},
    data () {
        return {
            dom: null
        }
    },
    methods: {
        resize () {
            this.dom.resize()
        }
    },
    mounted () {
        this.$nextTick(() => {
            //   let legend = this.value.map(_ => _.name);
            let option = {
                title: {
                    text: '在线时长',
                    textStyle: {
                        color: '#000',
                        fontWeight: 'normal',
                        fontSize: 14
                    },
                    padding: [25, 0, 0, 10]
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['教职工', '学生', '家长']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    type: 'value'
                },
                color: ['#2d8cf0', '#b65ab2', '#feb16e'],
                series: [
                    {
                        name: '教职工',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210],
                        lineStyle: {
                            color: '#2d8cf0'
                        }
                    },
                    {
                        name: '学生',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310],
                        lineStyle: {
                            color: '#b65ab2'
                        }
                    },
                    {
                        name: '家长',
                        type: 'line',
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410],
                        lineStyle: {
                            color: '#feb16e'
                        }
                    }
                ]
            }
            this.dom = echarts.init(this.$refs.dom, 'tdTheme')
            this.dom.setOption(option)
            on(window, 'resize', this.resize)
        })
    },
    beforeDestroy () {
        off(window, 'resize', this.resize)
    }
}
</script>
