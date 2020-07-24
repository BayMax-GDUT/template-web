import { login, logout, getUserInfo } from '@/api/login'
import {
    setAccessToken,
    getAccessToken,
    setSourceOrganizationIdInLocalstorage,
    getSourceOrganizationIdFromLocalstorage,
    setOrganizationId,
    getOrganizationId
} from '@/libs/util'
import userAvatar from '../../assets/images/headerIcon.png'

export default {
    state: {
        hasGetInfo: false,
        accountCode:'',
        username: '',
        userId: '',
        avatar: userAvatar,
        accessToken: getAccessToken(),
        sourceOrganizationId: getSourceOrganizationIdFromLocalstorage(),
        access: [],
        unreadCount: 0,
        messageUnreadList: [],
        messageReadList: [],
        messageTrashList: [],
        messageContentStore: {},
        superAdminFlag: '',
        organizationId: getOrganizationId(),
        organizationName: '',
        organizationType: '',
        logo: '',
        routers: [],
        name:'',
        phone: ''
    },
    getters: {
        messageUnreadCount: state => state.messageUnreadList.length,
        messageReadCount: state => state.messageReadList.length,
        messageTrashCount: state => state.messageTrashList.length
    },
    mutations: {
        setHasGetInfo (state, status) {
            state.hasGetInfo = status
          },
        setAccountCode (state, accountCode){
            state.accountCode = accountCode
        },
        setAvatar (state, avatar) {
            state.avatar = avatar || userAvatar
        },
        setUserId (state, id) {
            state.userId = id
        },
        setAccess (state, access) {
            state.access = access
        },
        setPhone (state, phone) {
            state.phone = phone
        },
        setOrganizationType (state, organizationType) {
            state.organizationType = organizationType
        },
        setOrganizationName (state, organizationName) {
            state.organizationName = organizationName
        },
        setAccessToken (state, accessToken) {
            state.accessToken = accessToken
            setAccessToken(accessToken)
        },
        setSourceOrganizationId (state, organizationId) {
            if (organizationId) {
                state.sourceOrganizationId = organizationId
                setSourceOrganizationIdInLocalstorage(organizationId)
            }
        },
        setLogo (state, logo) {
            state.logo = logo
        },
        setRouters (state, routers) {
            state.routers = routers
        },
        setName (state, name) {
            state.name = name
        },
        setIsInchargedId (state, id) {
            state.isInchargedId = id
        }
    },
    actions: {
        // 登录
        handleLogin ({ commit }, { accountCode, password, captcha, uuid }) {
            accountCode = accountCode.trim()
            password = password.trim()
            captcha = captcha.trim()
            uuid = uuid.trim()
            return new Promise((resolve, reject) => {
                login({
                    accountCode,
                    password,
                    captcha,
                    uuid
                }).then(res => {
                    let { data } = res.data
                    if (res.data.code === 200000 && data.token) {
                        commit('setAccessToken', data.token)
                        // commit('setRefreshToken', refresh_token)
                    }
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 清除登录信息
        clearInfo ({ commit, dispatch }) {
            commit('setHasGetInfo', false)
            commit('setLogo', '')
            commit('setAccessToken', '')
            // commit('setRefreshToken', '')
            commit('setAccess', [])
            commit('setRouters', [])
            commit('setOrganizationType', '')
            commit('setOrganizationName', '')
            commit('setSourceOrganizationId', 'none')
            dispatch('resetTagNavList')
        },
        clearIncharge({ commit, dispatch}){
            commit('setHasGetInfo', false)
            commit("setIsInchargedId", '');
            dispatch('resetTagNavList')
        },
        // 退出登录
        handleLogout ({ commit, dispatch }) {
            logout()
            sessionStorage.removeItem("isInchargedId");
            commit('setHasGetInfo', false)
            commit("setIsInchargedId", '');
            commit('setLogo', '')
            commit('setAccessToken', '')
            // commit('setRefreshToken', '')
            commit('setAccess', [])
            commit('setRouters', [])
            commit('setOrganizationType', '')
            commit('setOrganizationName', '')
            commit('setSourceOrganizationId', 'none')
            dispatch('resetTagNavList')
        },
        // 获取用户相关信息
        getUserInfo ({ commit }) {
            let postObj = {}
            return new Promise((resolve, reject) => {
                getUserInfo(postObj).then(res => {
                    const { code, data } = res.data
                    if (code === 200000 && data) {
                        commit('setHasGetInfo', true)
                        commit('setAccountCode', data.accountCode)
                        commit('setUserId', data.id)
                        commit('setAvatar', data.avatar)
                        commit('setAccess', data.perms)
                        commit('setName', data.name)
                        commit('setPhone', data.phone)
                        commit('setOrganizationType', data.organizationType)
                        commit('setOrganizationName', data.organizationName)
                        // resolve(data.route)
                    }
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
        getUnreadMessageCount ({ commit }) {
            // getUnreadCount().then(res => {
            //     const { data } = res
            // commit('setMessageCount', 3)
            // })
        },
        // 获取消息列表，其中包含未读、已读、回收站三个列表
        getMessageList ({ commit }) {
            // return new Promise((resolve, reject) => {
            //     getMessage().then(res => {
            //         const { unread, read, trash } = res.data
            //         commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
            //         commit('setMessageReadList', read.map(_ => {
            //             _.loading = false
            //             return _
            //         }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
            //         commit('setMessageTrashList', trash.map(_ => {
            //             _.loading = false
            //             return _
            //         }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
            //         resolve()
            //     }).catch(error => {
            //         reject(error)
            //     })
            // })
        },
        // 根据当前点击的消息的id获取内容
        getContentByMsgId ({ state, commit }, { msg_id }) {
            // return new Promise((resolve, reject) => {
            //     let contentItem = state.messageContentStore[msg_id]
            //     if (contentItem) {
            //         resolve(contentItem)
            //     } else {
            //         getContentByMsgId(msg_id).then(res => {
            //             const content = res.data
            //             commit('updateMessageContentStore', { msg_id, content })
            //             resolve(content)
            //         })
            //     }
            // })
        },
        // 把一个未读消息标记为已读
        hasRead ({ state, commit }, { msg_id }) {
            // return new Promise((resolve, reject) => {
            //     hasRead(msg_id).then(() => {
            //         commit('moveMsg', {
            //             from: 'messageUnreadList',
            //             to: 'messageReadList',
            //             msg_id
            //         })
            //         commit('setMessageCount', state.unreadCount - 1)
            //         resolve()
            //     }).catch(error => {
            //         reject(error)
            //     })
            // })
        },
        // 删除一个已读消息到回收站
        removeRead ({ commit }, { msg_id }) {
            // return new Promise((resolve, reject) => {
            //     removeRead(msg_id).then(() => {
            //         commit('moveMsg', {
            //             from: 'messageReadList',
            //             to: 'messageTrashList',
            //             msg_id
            //         })
            //         resolve()
            //     }).catch(error => {
            //         reject(error)
            //     })
            // })
        },
        // 还原一个已删除消息到已读消息
        restoreTrash ({ commit }, { msg_id }) {
            // return new Promise((resolve, reject) => {
            //     restoreTrash(msg_id).then(() => {
            //         commit('moveMsg', {
            //             from: 'messageTrashList',
            //             to: 'messageReadList',
            //             msg_id
            //         })
            //         resolve()
            //     }).catch(error => {
            //         reject(error)
            //     })
            // })
        }
    }
}
