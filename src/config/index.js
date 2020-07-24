import userAvatar from '../assets/images/headerIcon.png'
import devingImg from '../assets/images/deving.jpg'
import defaultAppIcon from '../assets/images/defaultAppIcon.png'
export default {
    /**
     * @description 配置显示在浏览器标签的title
     */
    // title: '创教云', // 取消，使用环境变量设置
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description 是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: false,
    /**
     * @description api请求基础路径
     */
    baseUrl: {
        // 本地环境
        dev: 'http://localhost:8053',
        // 台式机环境
        // dev: 'http://192.168.5.38:8053',
        // 使用正式环境测试前端
        // dev: 'http://api.manage.cvaiedu.com',
        prod: 'http://api.manage.cvaiedu.com',
        test: 'http://api.test.i4city.cn'
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',
    /**
     * @description 401 异常重试次数
     */
    retryCount: 5,
    /**
    * @description 默认头像
    */
    userAvatar,
    /**
    * @description 功能模块开发中默认图片
    */
    devingImg,
    /**
    * @description 应用的默认图标
    */
   defaultAppIcon
}
