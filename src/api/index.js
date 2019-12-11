import ajax from './ajax'
const BASE_URL = ''
export const reqLogin = (userName,password,that) => {
    // console.log({userName,password})
    return ajax(BASE_URL+'/authentication/login',{userName,password},'POST',that)
}
export const reqGetAllUsers = (that) => {
    // console.log({userName,password})
    return ajax(BASE_URL+'/api/users',null,'GET',that)
}
export const reqUpdateUser = (userId,email,phone,that)=>{
    return ajax(BASE_URL+'/api/users/'+userId,{email,phone},'PUT',that)
}
//更新用户角色(传递的是角色名称)
export const reqUpdateUserInRoleName = (userRole,that) =>ajax(BASE_URL+'/api/userRolesInRoleName',userRole,'PUT',that)
//获取所有用户角色
export const reqGetAllRoles = (that)=>ajax(BASE_URL+'/api/roles',null,'GET',that)
//创建用户
export const reqCreateUser = (username,email,phone,that)=>{
    return ajax(BASE_URL+'/api/users/'+username,{email,phone},'POST',that)
}
export const reqDeleteUser = (userID,that)=>{
    return ajax(BASE_URL+'/api/users/'+userID,null,'DELETE',that)
}
export const reqGetRoleByID = (roleID,that)=>{
    return ajax(BASE_URL+'/api/roles/'+roleID,null,'GET',that)
}
export const reqGetRoles= (that)=>{
    return ajax(BASE_URL+'/api/roles',null,'GET',that)
}
export const reqUpdateRolePermission = (roleID,authName,permissionNames,that)=>{
    return ajax(BASE_URL+'/api/rolePermissions/'+roleID,{authName,permissionNames},'PUT',that)
}
//导入数据
export const reqInsertScore = (scoreList,that)=>{
    return ajax(BASE_URL+'/api/scores',scoreList,'POST',that)
}