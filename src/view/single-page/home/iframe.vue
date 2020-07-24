<template>
    <div ref="div" style="height:100%;background-color:#fff">
        <iframe :src="src" allowtransparency="true" style="border:0;width:100%;height:100%;" frameborder="0" @load="onload"></iframe>
    </div>
</template>
<script>
export default {
    methods: {
        onload () {
            this.$refs.div.style.opacity = 1 // 读取成功后显示内容
        }
    },
    computed: {
        src () {
            return this.$route.meta.src // 自动读取路由的meta.src属性
        }
    },
    watch: {
        src () {
            this.$refs.div.style.opacity = 0 // 路由切换时隐藏内容
        }
    }
}
</script>
