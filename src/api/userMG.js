import axios from 'axios';
// 全局路径 请求的路径
// axios.defaults.baseURL = 'http://8.130.21.96:7777'
import { loginreq, req } from './axiosFun';

// 登录接口
export const login = (params) => { return loginreq("post", "/api/user/login", params) };
// 获取验证码
// export const getcodema = () =>{
//   return axios.get("/api/kaptcha.jpg",{responseType:'blob'}).then(res =>res.data)
// }
// 获取用户菜单
export const menu = (params) => { return axios.get("/api/menu?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 退出接口
export const loginout = () => { return req("post", "/api/user/logout") };

/**
 * 用户管理
 **/
// 用户管理-获取用户列表
export const userList = (params) => { return req("post", "/api/user/list", params) };
// 用户管理-保存（添加编辑）
export const userSave = (params) => { return req("post", "/api/user/save", params) };
// 用户管理-保存(核对用户名)
export const checkUserName = (params) => {return req("post", "/api/user/checkUserNme", params)}
// 用户管理-删除用户
export const userDelete = (params) => { return req("post","/api/user/delete",params)};
// export const userDelete = (params) => { return axios.delete("/api/deleteById?id=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 用户管理-重置密码
export const userPwd = (params) => { return req("post", "/api/user/resetpwd", params) };
// 用户管理-修改状态
export const userStatus = (params) => { return req("post", "/api/user/status", params) };
// 用户管理-分配角色
export const changeRole = (params) => { return  req("post", "/api/user/changeRole", params) };
// 用户管理-数据权限保存
export const UserDeptSave = (params) => { return req("post", "/api/UserDept/save", params) };
// 用户管理-获取部门设置
export const UserDeptdeptTree = (params) => { return axios.get("/api/UserDept/deptTree/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 用户管理-保存部门设置
export const UserChangeDept = (params) => { return req("post", "/api/User/change/dept", params) };
// 用户管理-用户下线
export const userExpireToken = (params) => { return req("get", "/api/User/expireToken/" + params, {}) };
// 用户管理-刷新缓存
export const userFlashCache = (params) => { return req("get", "/api/User/flashCache/" + params, {}) };

/**
 * 菜单管理
 **/
// 菜单管理-获取菜单Module/list
export const ModuleList = () => { return req("post", "/api/Module/list") };
// 菜单管理-根据菜单获取数据
export const ModuleGet = (params) => { return axios.get("/api/Module/get/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 菜单管理-获取父级菜单Module/nodes
export const ModuleNodes = (params) => { return req("post", "/api/Module/nodes", params) };
// 菜单管理-修改菜单
export const ModuleSave = (params) => { return req("post", "/api/Module/save", params) };
// 菜单管理-删除菜单
export const ModuleDelete = (params) => { return axios.delete("/api/Module/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 角色管理
 **/
// 角色管理-获取角色列表
export const roleList = (params) => { return req("post", "/api/role/list", params) };
// 角色管理-保存（添加编辑）
export const roleSave = (params) => { return req("post", "/api/role/save", params) };
// 角色管理-删除角色
export const roleDelete = (params) => { return req("post","/api/role/delete",params) };
// 角色管理-菜单权限（获取）
export const RoleRightTree = (params) => { return  req("post", "/api/role/menu", params)};
// 角色管理-菜单权限（获取树）
export const MenuTree = (params) => { return req("post","/api/menu/tree",params) };

// 角色管理-菜单权限（保存）
export const RoleRightSave = (params) => { return req("post", "/api/role/changemenu", params) };

/**
 * 部门管理
 **/
// 部门管理-获取部门列表
export const deptList = (params) => { return req("post", "/api/dept/list", params) };
// 部门管理-保存（添加编辑）
export const deptSave = (params) => { return req("post", "/api/dept/save", params) };
// 部门管理-删除部门
export const deptDelete = (params) => { return req("post", "/api/dept/delete", params) };
// 部门管理-修改状态
export const deptStatus = (params) => { return req("post", "/api/dept/status", params) }
// 部门管理-查看员工列表
export const listEmpDataDept = (params) => { return req("post", "/api/dept/listEmp", params) }

/**
 * 职位管理
 */

// 职位管理-获取职位列表
export const jobList = (params) => { return req("post", "/api/job/list", params) };
// 职位管理-保存（添加编辑）
export const jobSave = (params) => { return req("post", "/api/job/save", params) };
// 职位管理-删除职位
export const jobDelete = (params) => { return req("post", "/api/job/delete", params) };
// 职位管理-修改状态
export const jobStatus = (params) => { return req("post", "/api/job/status", params) }
// 职位管理-查看员工列表
export const listEmpDataJob = (params) => { return req("post", "/api/job/listEmp", params) }

/**
 * 员工管理
 */

// 员工管理-获取员工列表
export const empList = (params) => { return req("post", "/api/emp/list", params) };
// 员工管理-修改状态
export const empStatus = (params) => { return req("post", "/api/emp/status", params) };
// 员工管理-保存（添加编辑）
export const empSave = (params) => { return req("post", "/api/emp/save", params) };
// 员工管理-删除员工
export const empDelete = (params) => { return req("post","/api/emp/delete",params)};
// 员工管理-分配部门
export const changeDept = (params) => { return  req("post", "/api/emp/changeDept", params) };
// 员工管理-分配岗位
export const changeJob = (params) => { return  req("post", "/api/emp/changeJob", params) };
/**
 * 系统环境变量
 **/
// 系统环境变量-获取系统环境变量列表
export const variableList = (params) => { return req("post", "/api/Variable/list", params) };
// 系统环境变量-保存（添加编辑）
export const variableSave = (params) => { return req("post", "/api/Variable/save", params) };
// 系统环境变量-删除系统环境变量
export const variableDelete = (params) => { return axios.delete("/api/Variable/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 权限管理
 **/
// 权限管理-获取权限列表
export const permissionList = (params) => { return req("post", "/api/menu/list", params) };
// 权限管理-修改状态
export const menuStatus = (params) => { return req("post", "/api/menu/status", params) };
// 权限管理-保存权限
export const ermissionSave = (params) => { return req("post", "/api/menu/save", params) };
// 权限管理-删除权限
export const ermissionDelete = (params) => {return req("post","/api/menu/delete",params) };
// 权限管理-获取权限
export const roleDropDown = () => { return axios.get("/api/Role/dropDown/all?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 权限管理-配置权限
export const RolePermission = (params) => { return req("post", "/api/RolePermission/save", params) };
