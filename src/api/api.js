import axios from 'axios';

let base = '';
// 后台api接口
let backendAPI = '/backend';

export const requestLogin = params => { return axios.post(`${backendAPI}/login`, params).then(res => res.data); };

export const getLogList = params => { return axios.post(`${backendAPI}/api/set/log`, params ).then(res => res.data);; };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };
