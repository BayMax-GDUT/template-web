<template>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <FormItem prop="accountCode">
            <Input v-model="form.accountCode" placeholder="请输入账号">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"/>
        </span>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"/>
        </span>
            </Input>
        </FormItem>
        <FormItem prop="captcha">
            <Row>
                <i-col span="12">
                    <Input v-model="form.captcha" placeholder="请输入验证码">
            <span slot="prepend">
              <Icon :size="14" type="md-card"/>
            </span>
                    </Input>
                </i-col>
                <i-col span="12">
                    <img :src="validCodeImg" v-if="validCodeImg.trim().length > 0" @click="handleRefresh" :style="{height:'33px',cursor:'pointer',background:'url(' + imgUrl + ') center -2px no-repeat'}"/>
<!--                    <div @click="handleRefresh" :style="{height:'33px',cursor:'pointer',background:'url(' + imgUrl + ') center -2px no-repeat'}"></div>-->
                </i-col>
            </Row>
        </FormItem>
        <FormItem>
            <Button @click="handleSubmit" type="primary" long>登录</Button>
        </FormItem>
    </Form>
</template>

<script>
import { uuid } from 'vue-uuid'
import config from '@/config'
import { getValidCode } from '@/api/login'

const env = process.env.VUE_APP_ENV
const baseUrl = config.baseUrl[env]

export default {
    name: 'LoginForm',
    props: {
        accountCodeRules: {
            type: Array,
            default: () => {
                return [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ]
            }
        },
        passwordRules: {
            type: Array,
            default: () => {
                return [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 6, message: '密码不能少于6位', trigger: 'blur' }
                ]
            }
        },
        validCodeRules: {
            type: Array,
            default: () => {
                return [
                    { required: true, message: '验证码不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    data () {
        return {
            uuid: '',
            baseUrl: baseUrl,
            imgUrl: '',
            validCodeImg: '',
            form: {
                accountCode: '',
                password: '',
                captcha: ''
            }
        }
    },
    created () {
        // this.init(uuid.v1())
        this.getCode()
    },
    computed: {
        rules () {
            return {
                accountCode: this.accountCodeRules,
                password: this.passwordRules,
                captcha: this.validCodeRules
            }
        }
    },
    methods: {
        getCode () {
            let currentUuid = uuid.v1()
            getValidCode(currentUuid).then(res => {
                const { data } = res.data
                this.validCodeImg = data.image
                this.uuid = currentUuid
            })
        },
        // init (uuid) {
        //     this.deviceId = uuid
        //     this.imgUrl = this.baseUrl + '/v1/auth/captcha?uuid=' + uuid
        // },
        handleRefresh () {
            this.getCode()
        },
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$emit('on-success-valid', {
                        accountCode: this.form.accountCode,
                        password: this.form.password,
                        captcha: this.form.captcha,
                        uuid: this.uuid
                    })
                }
            })
        }
    }
}
</script>
