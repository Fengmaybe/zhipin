/*
包含所有action creator函数的模块
 */
import io from 'socket.io-client';

import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadChatMsg
} from '../api';
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_Chat_MSG,
  RECEIVE_Chat_MSGS,
  MSG_READ
} from './action_types';


//同步成功
export const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});

//同步失败
export const errorMsg = (msg) => ({type: ERROR_MSG, data: msg});

//同步的成功更新RECEIVE_USER
export const receiveUser = (user) => ({type: RECEIVE_USER, data: user});

//同步的失败更新RESET_USER
export const resetUser = (msg) => ({type: RESET_USER, data: msg});

//同步用户列表的action
export const receiveUserList = (user) => ({type: RECEIVE_USER_LIST, data: user});

//同步的接受用户消息列表--{users,chatMsgs}是异步去获取服务器后端的路由'/userlist'，返回数据响应{users,chatMsgs}
export const receiveChatMsgs = ({users, chatMsgs,meId}) => ({type: RECEIVE_Chat_MSGS, data: {users, chatMsgs,meId}});

//同步的接受用户一条消息--chatMsg是一个检测服务器发给浏览器的一个消息对象：{chat_id,create_time,content,from,to}
export const receiveChatMsg = (chatMsg,meId) => ({type: RECEIVE_Chat_MSG, data: {chatMsg,meId}});

// 读取了消息的同步action
const msgRead = ({from, to, count}) => ({type: MSG_READ, data: {from, to, count}});


//异步注册action模块，处理ajax请求--调用者要传入一个user给我
export const register = (user) => {
  //在发送请求时之前，处理前台表单验证（同步的代码）
  const {username, password, rePassword, type} = user;
  if (!username) {
    return errorMsg('用户名不能为空！')
  } else if (!password) {
    return errorMsg('密码不能为空！')
  } else if (password !== rePassword) {
    return errorMsg('两次密码输入不一致！')
  } else if (!type) {
    return errorMsg('请选择注册类型！')
  }

  return async dispatch => {
    //用async await实现
    const response = await reqRegister(user);
    const result = response.data;
    if (result.code === 0) {
      getChatMsgs(dispatch,result.data._id);
      //注册成功。分发一个成功的action
      dispatch(authSuccess(result.data));
    } else {
      //注册失败。分发一个失败的action
      dispatch(errorMsg(result.msg));
    }

    /* //1.执行异步代码，发ajax请求 2.有结果，分发一个同步的action
     reqRegister(user).then(res=>{
       //拿到响应的数据
       const result = res.data;
       if(result.code === 0){
         //注册成功。分发一个成功的action
         dispatch(authSuccess(result.data));
       }else{
         //注册失败。分发一个失败的action
         dispatch(errorMsg(result.msg));
       }
     })*/
  }
};

//异步登录action模块，处理ajax请求--也处理一些前端表单验证
export const login = (user) => {
  //在发送请求时之前，处理前台表单验证，放在异步函数内（与注册不同）
  const {username, password} = user;

  return async dispatch => {
    //处理前台表单验证，分发同步action对象
    if (!username) {
      dispatch(errorMsg('用户名不能为空！'));
      return;
    } else if (!password) {
      dispatch(errorMsg('密码不能为空！'));
      return;
    }
    const response = await reqLogin(user);
    const result = response.data;
    if (result.code === 0) {
      getChatMsgs(dispatch,result.data._id);
      //注册成功。分发一个成功的action
      dispatch(authSuccess(result.data));
    } else {
      //注册失败。分发一个失败的action
      dispatch(errorMsg(result.msg));
    }
  }
};

//异步更新用户信息-user表示完善信息页面的新的状态
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user);
    console.log(response);
    const result = response.data;
    //判断更新成功或失败
    if (result.code === 0) {
      //成功--分发
      dispatch(receiveUser(result.data));
      console.log(result.data);

    } else {
      //失败
      dispatch(resetUser(result.msg));
    }
  }
};

//异步获取用户信息，来实现自动登录
export const getUser = () => {
  return async dispatch => {
    const response = await reqUser();
    const result = response.data;
    if (result.code === 0) {
      getChatMsgs(dispatch,result.data._id);
      //获取用户消息成功
      dispatch(receiveUser(result.data));
    } else {
      //获取用户消息失败
      dispatch(resetUser(result.msg));
    }
  }
};

//异步获取用户列表，来根据type来获取数据库信息用户
export const getUserList = (type) => {
  return async dispatch => {
    const response = await reqUserList(type);
    const result = response.data;
    if (result.code === 0) {
      //请求成功，获取到了用户列表数组
      dispatch(receiveUserList(result.data));
    }
  }
};

//执行一次：连接对象socket（服务器-浏览器）
const socket = io('ws://localhost:4000');

//客户端监听服务器返回的消息数据
const initSocketIO = (dispatch,meId)=>{
  if(!io.socket){  //保证on只是执行一次
    //？？？?可以不要嘛
    io.socket = socket;
    //2.监听服务器返回的数据
    socket.on('sendMsgToBrowser', (chatMsg) => {
      console.log(chatMsg);
      //监听到关于我的信息，我才接受啊。
      if(meId===chatMsg.to || meId===chatMsg.from) {  // 发给我的/我发去的
        //分发同步的action-接受一条消息-触发reducers去更新
        dispatch(receiveChatMsg(chatMsg,meId));
        console.log('2.服务器->浏览器的chatMsg', chatMsg);
      }


    });
  }
};

//异步给服务器发送信息（socketIO）
export const sendMsg = ({content, from, to}) => {
  return async dispatch => {
    //1.向服务发送
    socket.emit('sendMsgToServer', {content, from, to});

    console.log('1.浏览器->服务器的信息', {content, from, to});
  }
};


//获取当前用户与所有用户发送的消息列表，再分发一个同步acting---这个函数在哪调用的问题？？3个地方
const getChatMsgs = async (dispatch,meId) => {
  //绑定接受新消息的监听--函数调用多次，但只会监听一次
  initSocketIO(dispatch,meId);

  //1.发送ajax请求，后台给数据--不需要参数
  const response = await reqChatMsgList();
  const result = response.data;
  if(result.code === 0){
    //2.分发同步action去触发reducers去更新state---(result.data是一个对象，对象有两个属性，users{}和chatMsgs[])
    const {users,chatMsgs} = result.data;
    dispatch(receiveChatMsgs({users,chatMsgs,meId}));
  }
};


//查看更新未读消息的异步action
export function readChatMsg(from, to) {
  return async dispatch => {
    const response = await reqReadChatMsg(from);
    const result = response.data;
    if(result.code===0) {
      //获取此时返回的一条信息的count（总数）
      const count = result.data;
      dispatch(msgRead({from, to, count}));
    }
  }
}
