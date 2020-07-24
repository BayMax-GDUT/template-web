import HttpRequest from '@/libs/axios'
import config from '@/config'

const env = process.env.VUE_APP_ENV
export const baseUrl = config.baseUrl[env]

const axios = new HttpRequest(baseUrl)
export default axios
