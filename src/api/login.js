import axios from '@/libs/api.request'

/**
 * 获取验证码
 * @param uuid
 * @returns {ClientHttp2Stream | ClientRequest | * | void | Promise<AxiosResponse<T>>}
 */
export const getValidCode = (uuid) => {
    return axios.request({
        method: 'get',
        url: '/v1/auth/captcha',
        params: {
            uuid
        }
    })
}

/**
 * 登录(获取token)
 * @param username
 * @param password
 * @param validCode
 * @param deviceId
 * @returns {*|void|ClientRequest|ClientHttp2Stream|Promise<AxiosResponse<T>>}
 */
export const login = ({ username, password, captcha, uuid }) => {
    const data = {
        username: username,
        password: password,
        captcha: captcha,
        uuid: uuid
    }
    return axios.request({
        method: 'post',
        url: '/v1/auth/login',
        data: data
    })
}

/**
 * 获取我的信息
 *
 * @returns {never}
 */
export const getUserInfo = (obj) => {
    return axios.request({
        method: 'get',
        url: '/v1/auth/getUserInfo',
        params: obj
    })
}

export const logout = () => {
    return axios.request({
        method: 'get',
        url: '/v1/auth/logout'
    })
}

/**
 * 	跳转到第三方应用
 * @param {*} obj 
 */
export const amloginThirdParty = (obj) => {
    return axios.request({
        method: 'get',
        url: '/v1/auth/loginThirdParty',
        params: obj
    })
}


/**
 * 图片上传
 * @param file
 * @returns {url}
 */
export const uploadImg = (file) => {
    return axios.request({
        method: 'post',
        url: '/uploadImg',
        data: file
    })
}