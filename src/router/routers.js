import Main from '@/components/main'

/**
 * iView-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/view/login/login.vue')
    },
    {
        path: '/',
        redirect: '/home',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    hideInMenu: true,
                    title: '首页',
                    notCache: true,
                    icon: 'md-home'
                },
                component: () => import('@/view/single-page/home')
            },
            {
                path: '/message',
                name: 'message',
                meta: {
                    icon: 'md-notifications',
                    title: '消息中心'
                },
                component: () => import('@/view/single-page/message/index.vue')
            },
            {
                path: '/personal',
                name: 'personal',
                meta: {
                    icon: 'md-person',
                    title: '个人中心'
                },
                component: () => import('@/view/single-page/personal/index.vue')
            }
        ]
    },
    {
        path: '/report-task',
        component: Main,
        name: 'report-task',
        meta: {
            icon: 'ios-nuclear',
            showAlways: true,
            access: ['framework'],
            title: '数据上报'
        },
        children: [
            {
                path: 'user',
                component: () => import('@/view/report-task/task/index.vue'),
                name: 'report-task task',
                meta: {
                    icon: 'ios-contacts-outline',
                    access: ['framework'],
                    title: '数据上报工作（上级）'
                }
            }
        ]
    }
    // {
    //     path: '/sys',
    //     component: Main,
    //     name: 'sys',
    //     meta: {
    //         icon: 'ios-nuclear',
    //         showAlways: true,
    //         access: ['sys'],
    //         title: '系统管理'
    //     },
    //     children: [
    //         {
    //             path: 'user',
    //             component: () => import('@/view/sys/user/index.vue'),
    //             name: 'sys user',
    //             meta: {
    //                 icon: 'ios-contacts-outline',
    //                 access: ['sys:user'],
    //                 title: '用户管理'
    //             }
    //         },
    //         {
    //             path: 'organization',
    //             component: () => import('@/view/sys/organization/index.vue'),
    //             name: 'sys organization',
    //             meta: {
    //                 icon: 'ios-settings-outline',
    //                 access: ['sys:setting'],
    //                 title: '系统设置'
    //             }
    //         },
    //         {
    //             path: 'role',
    //             component: () => import('@/view/sys/permission/index.vue'),
    //             name: 'sys menu',
    //             meta: {
    //                 icon: 'ios-unlock-outline',
    //                 access: ['sys:role'],
    //                 title: '权限管理'
    //             }
    //         },
    //         {
    //             path: 'log',
    //             component: () => import('@/view/sys/log/index.vue'),
    //             name: 'sys log',
    //             meta: {
    //                 icon: 'ios-paper-outline',
    //                 access: ['sys:log'],
    //                 title: '操作日志'
    //             }
    //         }
    //     ]
    // },
]
