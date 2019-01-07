import axios from 'axios';
let base = '';
// 后台api接口
let backendAPI = '/backend';

// 登录接口
export const requestLogin = params => { return axios.post(`${backendAPI}/login`, params).then(res => res.data); };
// 注销接口
export const requestLogout = params => { return axios.post(`${backendAPI}/logout`, params).then(res => res.data); };
// 获取日志接口
export const getLogList = params => { return axios.post(`${backendAPI}/api/set/log`, params ).then(res => res.data); };
// 获取日志类别接口
export const getLogType = params => { return axios.post(`${backendAPI}/api/set/logtype`,params ).then(res => res.data); };
// 导出日志
export const downloadLogExcel = `${backendAPI}/api/set/log/excel`
// 上传头像
export const uploadLogo = params => { return axios.post(`${backendAPI}/api/set/uploadlogo`,params ).then(res => res.data); };
// 获取个人信息
export const getPersonal = params => { return axios.get(`${backendAPI}/api/set/personal`,params ).then(res => res.data); };
// 修改密码
export const setPassword = params => { return axios.put(`${backendAPI}/api/set/password`,params ).then(res => res.data); };
// 修改用户信息
export const setUserInfo = params => { return axios.put(`${backendAPI}/api/set/update`,params ).then(res => res.data); };
export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };
