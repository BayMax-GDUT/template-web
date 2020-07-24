import axios from 'axios'
import { getAccessToken } from '@/libs/util'
import store from '@/store'
import router from '@/router'
import iView, { Message } from 'iview'

class HttpRequest {
    constructor (baseUrl) {
        this.baseUrl = baseUrl
        this.queue = {}
    }

    getInsideConfig () {
        return {
            baseURL: this.baseUrl,
            headers: { 'Authorization': getAccessToken() }
        }
    }

    destroy (url) {
        delete this.queue[url]
        if (!Object.keys(this.queue).length) {
            //
        }
    }

    interceptors (instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
            // 添加全局的loading...
            if (!Object.keys(this.queue).length) {
                //
            }
            this.queue[url] = true
            return config
        }, error => {
            return Promise.reject(error)
        })
        // 响应拦截
        instance.interceptors.response.use(res => {
            this.destroy(url)
            // 如果是退出登录请求，不拦截
            if (url === '/v1/auth/logout') {
                return
            }
            const { data } = res
            // 状态码不等于200000属于异常情况
            if (data.code && data.code !== 200000) {
                switch (data.code) {
                case 401000: {
                    Message.error('token失效，请重新登录')
                    this.handleClearInfo()
                    break
                }
                default:
                    Message.error(data.msg)
                }
            }
            return { data }
        }, error => {
            this.destroy(url)
            const { code } = error.response
            if (code === 401000) {
                // 跳转登录页
                this.handleClearInfo()
            }
            Message.error('网络异常,请与管理员联系!')
            // return Promise.reject('网络异常,请与管理员联系!')
            //return Promise.reject(error)
        })
    }

    request (options) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }

    // 执行退出
    handleClearInfo () {
        store.dispatch('clearInfo').then(() => {
            router.push({
                name: 'login'
            })
        }).then(() => {
            iView.LoadingBar.finish()
        })
    }
}

export default HttpRequest
