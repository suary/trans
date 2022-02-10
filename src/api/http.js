import axios from 'axios'
import { Toast } from 'vant'
const service = axios.create({ 
  // 设置baseUr地址,如果通过proxy跨域可直接填写base地址
//   baseURL: process.env.SERVER_URL,
  // 定义统一的请求头部
  // headers: {
  //    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
  // },
  // 配置请求超时时间
  timeout: 10000, 
  // 如果用的JSONP，可以配置此参数带上cookie凭证，如果是代理和CORS不用设置
  withCredentials: true
});


//请求拦截
service.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.error(error)
    }
)

//响应拦截器
service.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据 
        // 否则的话抛出错误
        if(response.status === 200){
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    error => {
        if(error.response.status){
            switch (error.response.status){
                case 404:
                    Toast({
                        message:'网络请求不存在',
                        duration:1500,
                        forbidClick:true
                    })
                    break
                case 400:
                    Toast({
                        message:'服务器繁忙',
                        duration:1500,
                        forbidClick:true
                    })
                    break
                default:
                    Toast({
                        message:'其它提示',
                        duration:1500,
                        forbidClick:true
                    })  
            }
            return Promise.reject(error.response)
        }
    }
)
/** 
 * get方法，对应get请求
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */

 export function get(url,params={}){
     return new Promise((resolve,reject)=>{
        service.get(url,{
             params
         }).then(res=>{
             resolve(res.data)
         }).catch(err => {
             reject(err)
         })
     })
 }

 /**  
  * post方法，对应post请求  
  * @param {String} url [请求的url地址]  
  * @param {Object} params [请求时携带的参数]  
  */

  export function post(url,params){
    return new Promise((resolve,reject)=>{
        service.post(url,
            params
        ).then(res=>{
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
export default {
    get,
    post
}