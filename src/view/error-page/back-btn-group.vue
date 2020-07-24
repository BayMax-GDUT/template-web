<template>
    <div>
        <Button size="large" type="text" @click="backHome">返回首页</Button>
        <Button size="large" type="text" @click="backPrev">返回上一页（{{ second }}s）</Button>
    </div>
</template>

<script>
import './error.less'
import { mapMutations } from 'vuex'

export default {
    name: 'backBtnGroup',
    data () {
        return {
            second: 5,
            timer: null
        }
    },
    computed: {
        tagNavList () {
            return this.$store.state.app.tagNavList
        }
    },
    methods: {
        ...mapMutations([
            'setTagNavList',
            'setSourceOrganizationId'
        ]),
        backHome () {
            this.$router.replace({
                name: this.$config.homeName
            })
        },
        backPrev () {
            this.$router.go(-1)
        }
    },
    mounted () {
        this.timer = setInterval(() => {
            if (this.second === 0) {
                this.backPrev()
            } else {
                this.second--
            }
        }, 1000)
        // 关闭所有标签（首页除外）
        this.setTagNavList(this.tagNavList.filter(item => item.name === this.$config.homeName))
        this.setSourceOrganizationId('none')
    },
    beforeDestroy () {
        clearInterval(this.timer)
    }
}
</script>
