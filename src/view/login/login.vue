<template>
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="欢迎登录" :bordered="false">
                <div class="form-con">
                    <login-form ref="loginBox" @on-success-valid="handleSubmit"/>
                    <p class="login-tip">请输入用户名、密码、验证码登录</p>
                    <a class="beian" href="http://www.beian.miit.gov.cn" target="_blank">粤ICP备17135504号</a>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'

export default {
    components: {
        LoginForm
    },
    data () {
        return {
        }
    },
    methods: {
        ...mapActions([
            'handleLogin'
        ]),
        handleSubmit (obj) {
            this.handleLogin(obj).then(res => {
                const { code } = res.data
                if (code !== 200000) {
                    // 重新获取验证码
                    this.$refs.loginBox.handleRefresh()
                } else {
                    this.$router.push({
                        name: this.$config.homeName
                    }).catch(() => {
                        // 忽略错误
                    })
                }
            }).catch(err => {
                const { data: { msg } } = err.response
                this.$Message.error(msg)
                // 重新获取验证码
                this.$refs.loginBox.handleRefresh()
            })
        }
    }
}
</script>
<style lang="less">
@import './login.less';
</style>
