<template>
    <div>
        <Row :gutter="20">
            <i-col :xs="12" :md="8" :lg="6" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
                <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
                    <count-to :end="infor.count" count-class="count-style"/>
                    <p>{{ infor.title }}</p>
                </infor-card>
            </i-col>
        </Row>
        <Row :gutter="20" style="margin-top: 10px;">
            <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
                <Card shadow>
                    <chart-pie style="height: 300px;" :value="pieData" text="应用排行"></chart-pie>
                </Card>
            </i-col>
            <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
                <Card shadow>
                    <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
                </Card>
            </i-col>
        </Row>
        <Row>
            <Card shadow>
                <example style="height: 310px;"/>
            </Card>
        </Row>
    </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'

export default {
    name: 'home',
    components: {
        InforCard,
        CountTo,
        ChartPie,
        ChartBar,
        Example
    },
    data () {
        return {
            inforCardData: [
                { title: '教育局总数', icon: 'md-school', count: 1, color: '#2d8cf0' },
                { title: '学校总数', icon: 'md-book', count: 8, color: '#19be6b' },
                { title: '用户总数', icon: 'md-person', count: 896, color: '#ff9900' },
                { title: '新增用户', icon: 'md-person-add', count: 21, color: '#ed3f14' }
            ],
            pieData: [
                { value: 234, name: '智慧课堂' },
                { value: 135, name: '会议访客' },
                { value: 335, name: '智慧班牌' },
                { value: 310, name: '课堂录播' },
                { value: 1548, name: '课堂直播' }
            ],
            barData: {
                Mon: 13253,
                Tue: 34235,
                Wed: 26321,
                Thu: 12340,
                Fri: 24643,
                Sat: 1322,
                Sun: 1324
            }
        }
    },
    mounted () {
        //
    }
}
</script>

<style lang="less">
.count-style {
    font-size: 50px;
}
</style>
