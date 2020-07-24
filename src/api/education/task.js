import axios from '@/libs/api.request'

/**
 * 分页获取任务列表
 * @param obj
 * @returns {ClientHttp2Stream | ClientRequest | * | void | Promise<AxiosResponse<T>>}
 */
export const taskFindPage = (obj) => {
    return axios.request({
        method: 'get',
        url: '/v1/task/findPage',
        params: obj
    })
}

/**
 * 新增任务
 * @param obj
 * @returns {ClientHttp2Stream | ClientRequest | * | void | Promise<AxiosResponse<T>>}
 */
export const taskAdd = (obj) => {
    return axios.request({
        method: 'post',
        url: '/v1/task/add',
        data: obj
    })
}

/**
 * 更新任务
 * @param obj
 * @returns {ClientHttp2Stream | ClientRequest | * | void | Promise<AxiosResponse<T>>}
 */
export const taskUpdate = (obj) => {
    return axios.request({
        method: 'post',
        url: '/v1/task/update',
        data: obj
    })
}

/**
 * 根据id获取任务详情
 * @param obj
 * @returns {ClientHttp2Stream | ClientRequest | * | void | Promise<AxiosResponse<T>>}
 */
export const taskGetByPrimaryKey = (obj) => {
    return axios.request({
        method: 'get',
        url: '/v1/task/getByPrimaryKey',
        params: {
            id: obj.id
        }
    })
}

export const taskDelete = (obj) => {
    return axios.request({
        method: 'post',
        url: '/v1/task/delete',
        data: obj
    })
}
