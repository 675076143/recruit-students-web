import ajax from './ajax'
const BASE_URL = ''
export const reqLogin = (userName,password,that) => {
    // console.log({userName,password})
    return ajax(BASE_URL+'/authentication/login',{userName,password},'POST',that)
}