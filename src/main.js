// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { hasOneOf } from './libs/tools'
import { getOrganizationId, isAuthForScript, isAuth } from './libs/util'
import router from './router'
import store from './store'
import Bus from './libs/bus'
import ViewUI from 'iview'
import i18n from '@/locale'
import config from '@/config'
import { directive as clickOutside } from 'v-click-outside-x'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import echarts from 'echarts'
import MoreAction from '@/components/more-action'
import md5 from 'js-md5'

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer)
//配置项
Viewer.setDefaults({
  zIndexInline:9999
})


// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV === 'development') require('@/mock')

Vue.use(ViewUI, {
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
/**
 * @description 生产环境关掉提示
 */
Vue.config.devtools = false
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.$echarts = echarts
Vue.prototype.getOrganizationId = getOrganizationId
Vue.prototype.hasOneOf = hasOneOf
Vue.prototype.isAuthForScript = isAuthForScript
Vue.prototype.isAuth = isAuth
Vue.prototype.$md5 = md5
Vue.prototype.$bus = Bus

/**
 * 全局注册组件
 */
Vue.component('MoreAction', MoreAction)

/**
 * 注册指令
 */
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
})
