import Vue from 'vue'
import Router from 'vue-router'
import routers from './routers'
import store from '@/store'
import iView from 'iview'
import { getAccessToken, setTitle } from '@/libs/util'
import config from '@/config'

const { homeName } = config

Vue.use(Router)
const LOGIN_PAGE_NAME = 'login'
const options = {
    routes: routers,
    mode: 'history'
}
const router = new Router(options)

router.$addRoutes = (params) => {
    router.matcher = new Router(options).matcher
    router.addRoutes(params)
}

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    const accessToken = getAccessToken()
    if (!accessToken && to.name !== LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面不是登录页
        next({
            name: LOGIN_PAGE_NAME // 跳转到登录页
        })
    } else if (!accessToken && to.name === LOGIN_PAGE_NAME) {
        // 未登陆且要跳转的页面是登录页
        next() // 跳转
    } else if (accessToken && to.name === LOGIN_PAGE_NAME) {
        // 已登录且要跳转的页面是登录页
        next({
            name: homeName // 跳转到homeName页
        })
    } else {
        if(!store.state.user.hasGetInfo) store.dispatch('getUserInfo')
        next()
        // store.dispatch('getUserInfo').then(route => {
        //     let routers = []
        //     // 加载用户菜单
        //     if (route && route.length > 0) {
        //         routers = backendMenusToRouters(route)
        //         router.$addRoutes(routers)
        //         store.commit('setRouters', routers)
        //         next({ ...to })
        //     }
        // }).catch(() => {
        //     iView.LoadingBar.finish()
        //     store.dispatch('handleLogOut').then(() => {
        //         next({
        //             name: LOGIN_PAGE_NAME
        //         })
        //     })
        // })
    }
})

router.afterEach(to => {
    setTitle(to, router.app)
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

export default router
