/*
包含n个接口请求函数的模块
每个函数返回的都是promise对象
 */
import ajax from './ajax';

//注册接口
export const reqRegister = ({username,password,type})=> ajax('/register',{username,password,type},'POST');
//登录接口
export const reqLogin = ({username,password})=> ajax('/login',{username,password},'POST');
//更新接口(user表示在更新组件上一些新的完善信息的状态)
export const reqUpdateUser = (user) => ajax('/update',user,'POST');
//获取用户接口
export const reqUser = () => ajax('/user');
//获取用户列表
export const reqUserList = (type) => ajax('/userlist',{type});
// 请求获取当前用户的所有聊天记录-接口
export const reqChatMsgList = () => ajax('/msglist');
// 标识指定用户（给我from，谁跟我聊天的那个人）发送的聊天信息-接口（里面的to是当前用户）
export const reqReadChatMsg = (from) => ajax('/readmsg', {from}, 'POST');



