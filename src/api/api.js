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
// 上传笔记、消息图片
export const updateNewsPicture = params => { return axios.post(`${backendAPI}/api/oss/picture/illustrated`,params ).then(res => res.data); };
// 获取动态
export const getNewsList = params => { return axios.get(`${backendAPI}/api/message/news`,{ params: params } ).then(res => res.data); };
// 发布动态
export const publishNews = params => { return axios.post(`${backendAPI}/api/message/news/publish`,params ).then(res => res.data); };
// 删除动态
export const deleteNews = params => { return axios.delete(`${backendAPI}/api/message/news/delete`,{ params: params } ).then(res => res.data); };
// 查询动态
export const getNews = params => { return axios.get(`${backendAPI}/api/message/news/show`,{ params: params } ).then(res => res.data); };
// 修改动态
export const editNews = params => { return axios.put(`${backendAPI}/api/message/news/edit`,params ).then(res => res.data); };
// 审核留言
export const checkGuestBook = params => { return axios.put(`${backendAPI}/api/message/guestbook/check`,params ).then(res => res.data); };
// 查看分页留言
export const getGuestBookList = params => { return axios.get(`${backendAPI}/api/message/guestbook`,{ params: params } ).then(res => res.data); };
// 查看分页后的图片
export const getPictureList = params => { return axios.get(`${backendAPI}/api/oss/picture`,{ params: params } ).then(res => res.data); };
// 上传壁纸
export const uploadWallpaper = `${backendAPI}/api/oss/picture/wallpaper`
// 删除壁纸/插图
export const deletePicture = params => { return axios.delete(`${backendAPI}/api/oss/picture/delete`,{ params: params } ).then(res => res.data); };
// 上传文件
export const uploadFile = `${backendAPI}/api/oss/files/upload`
// 查看分页后的文件
export const getFileList = params => { return axios.get(`${backendAPI}/api/oss/files`,{ params: params } ).then(res => res.data); };
// 删除文件
export const deleteFile = params => { return axios.delete(`${backendAPI}/api/oss/files/delete`,{ params: params } ).then(res => res.data); };
// 修改文件
export const editFile = params => { return axios.put(`${backendAPI}/api/oss/files/edit`,params ).then(res => res.data); };
// 下载文件
export const downloadFileForAdmin = `${backendAPI}/api/oss/files/download/`
// 创建笔记簿
export const createNoteBook = params => { return axios.post(`${backendAPI}/api/message/notebook/create`,params ).then(res => res.data); };
// 修改笔记簿
export const updateNoteBook = params => { return axios.put(`${backendAPI}/api/message/notebook/edit`,params ).then(res => res.data); };
// 删除笔记簿
export const deleteNoteBook = params => { return axios.delete(`${backendAPI}/api/message/notebook/delete`,{ params: params } ).then(res => res.data); };
// 获取笔记簿列表
export const getNoteBookList = params => { return axios.get(`${backendAPI}/api/message/notebook`,{ params: params } ).then(res => res.data); };
// 获取笔记簿
export const getNoteBookGroup = params => { return axios.get(`${backendAPI}/api/message/notebook/group`,{ params: params } ).then(res => res.data); };
// 查询单条笔记簿
export const getNoteBook = params => { return axios.get(`${backendAPI}/api/message/notebook/show`,{ params: params } ).then(res => res.data); };
// 创建笔记
export const createNotes = params => { return axios.post(`${backendAPI}/api/message/notes/create`,params ).then(res => res.data); };
// 修改笔记
export const updateNotes = params => { return axios.put(`${backendAPI}/api/message/notes/edit`,params ).then(res => res.data); };
// 删除笔记
export const deleteNotes = params => { return axios.delete(`${backendAPI}/api/message/notes/delete`,{ params: params } ).then(res => res.data); };
// 获取笔记
export const getNotesList = params => { return axios.get(`${backendAPI}/api/message/notes`,{ params: params } ).then(res => res.data); };
// 查询单条笔记
export const getNotes = params => { return axios.get(`${backendAPI}/api/message/notes/show`,{ params: params } ).then(res => res.data); };
// 获取该月计划
export const getPlanList = params => { return axios.get(`${backendAPI}/api/set/plan`,{ params: params } ).then(res => res.data); };
// 添加计划
export const createPlan = params => { return axios.post(`${backendAPI}/api/set/plan/create`,params ).then(res => res.data); };
// 修改计划
export const updatePlan = params => { return axios.put(`${backendAPI}/api/set/plan/edit`,params ).then(res => res.data); };
// 删除计划
export const deletePlan = params => { return axios.delete(`${backendAPI}/api/set/plan/delete`,{ params: params } ).then(res => res.data); };
// 获取交易类别
export const getFinancialType = params => { return axios.get(`${backendAPI}/api/financial/transactionType`,params ).then(res => res.data); };
// 获取财政流水
export const getTransactionList = params => { return axios.get(`${backendAPI}/api/financial/transaction`,{ params: params } ).then(res => res.data); };
// 财政申报
export const applyTransaction = params => { return axios.post(`${backendAPI}/api/financial/insertTransaction`,params ).then(res => res.data); };
// 修改流水
export const updateTransaction = params => { return axios.put(`${backendAPI}/api/financial/updateTransaction`,params ).then(res => res.data); };
// 删除流水
export const deleteTransaction = params => { return axios.delete(`${backendAPI}/api/financial/deleteTransaction`,{ params: params } ).then(res => res.data); };
// 导出流水
export const downTransaction= `${backendAPI}/api/financial/outTransactionListExcel`
// 导出流水明细
export const outTransactionInfoExcel= `${backendAPI}/api/financial/outTransactionInfoExcel`
// 获取流水明细
export const getTransactionInfo = params => { return axios.get(`${backendAPI}/api/financial/transactionInfo`,{ params: params } ).then(res => res.data); };
// 添加流水明细
export const insertTransactioninfo = params => { return axios.post(`${backendAPI}/api/financial/insertTransactioninfo`,params ).then(res => res.data); };
// 修改流水明细
export const updateTransactioninfo = params => { return axios.put(`${backendAPI}/api/financial/updateTransactioninfo`,params ).then(res => res.data); };
// 删除流水明细
export const deleteTransactioninfo = params => { return axios.delete(`${backendAPI}/api/financial/deleteTransactioninfo`,{ params: params } ).then(res => res.data); };
// 按天统计流水
export const totalTransactionForDay = params => { return axios.get(`${backendAPI}/api/financial/totalTransactionForDay`,{ params: params } ).then(res => res.data); };
// 导出按天统计的报表
export const outTransactionForDayExcel= `${backendAPI}/api/financial/outTransactionForDayExcel`
// 按月统计流水
export const totalTransactionForMonth = params => { return axios.get(`${backendAPI}/api/financial/totalTransactionForMonth`,{ params: params } ).then(res => res.data); };
// 导出按月统计的报表
export const outTransactionForMonthExcel= `${backendAPI}/api/financial/outTransactionForMonthExcel`
// 按年统计流水
export const totalTransactionForYear = params => { return axios.get(`${backendAPI}/api/financial/totalTransactionForYear`,{ params: params } ).then(res => res.data); };
// 导出按月统计的报表
export const outTransactionForYearExcel= `${backendAPI}/api/financial/outTransactionForYearExcel`
// 创建接口
export const createApi = params => { return axios.post(`${backendAPI}/api/set/api/create`,params ).then(res => res.data); };
// 修改接口
export const editApi = params => { return axios.put(`${backendAPI}/api/set/api/edit`,params ).then(res => res.data); };
// 删除笔记
export const deleteApi = params => { return axios.delete(`${backendAPI}/api/set/api/delete`,{ params: params } ).then(res => res.data); };
// 获取接口
export const getApi = params => { return axios.get(`${backendAPI}/api/set/api/list`,{ params: params } ).then(res => res.data); };
// 查看数据库备份执行列表
export const getBackUpDBList = params => { return axios.get(`${backendAPI}/api/oss/db`,{ params: params } ).then(res => res.data); };
// 下载备份的数据库文件
export const downloadBackUpDB = `${backendAPI}/api/oss/db/download/`
// 获取后台监控统计
export const getDashBoard = params => { return axios.get(`${backendAPI}/api/set/dashBoard`,{ params: params } ).then(res => res.data); };
