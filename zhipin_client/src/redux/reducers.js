/*
包含n个用于生成新的state的reducer函数的模块
用combineReducers({})
*/
import {combineReducers} from 'redux';
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RESET_USER,
  RECEIVE_USER,
  RECEIVE_USER_LIST,
  RECEIVE_Chat_MSGS,
  RECEIVE_Chat_MSG,
  MSG_READ
} from './action_types';

import {getRedirectTo} from '../utils';

//需要管理的状态
const initUser = {
  username: '',
  type: '',
  msg: '',
  redirectTo: ''  //注册或登录成功后重定向的地址
};
//触发user的reducers函数
const user = (state = initUser, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      //拿到action对象中的数据
      const user = action.data;
      //返回出去一个最新的状态{}，此时写法是msg返回的是一个undefined
      return {...user, redirectTo: getRedirectTo(user.type, user.header)};
    case ERROR_MSG:
      return {...initUser, msg: action.data};
    case RESET_USER:
      return {...initUser, msg: action.data};
    case RECEIVE_USER:    //更新成功
      return action.data;   //这个时候msg和redirectto为空，并且多了很多状态，action.data。
    // 数据库中是不会保存redirectto的信息的。只有注册和更新完善信息的两个路由才会保存数据库，其他操作都是读取对比数据库信息。
    default :
      return state
  }
};

/*------------------*/

//userList用户列表的reducers函数
const initUserList = [];
const userList = (state = initUserList, action) => {
  switch (action.type) {
    case RECEIVE_USER_LIST:
      return action.data;
    default :
      return state;
  }
};

/*-------------------*/
//chat相关的reducers
const initChat={
  users:{},
  chatMsgs:[],
  unReadCount:0  //总的未读数量
};
const chat =  (state=initChat,action) => {
  switch (action.type){
    case RECEIVE_Chat_MSGS:
      var {users, chatMsgs,meId} = action.data;
      return {
        users,
        chatMsgs,
        unReadCount:chatMsgs.reduce(function (preCount, msg) {
          // msg是别人发给我的未读消息,依次累加
          return preCount + (!msg.read && msg.to===meId ? 1 : 0)
        }, 0),
      };
    case RECEIVE_Chat_MSG:
      var data = action.data;
      console.log('wode data si');
      console.log(data);
      return {
        users:state.users,
        chatMsgs:[...state.chatMsgs,data.chatMsg],
        //当我发一条信息过来要判断（read  是不是给我的消息）
        unReadCount: state.unReadCount + (!data.chatMsg.read && data.chatMsg.to===data.meId ? 1 : 0),
      };
    case MSG_READ:
      const {from, to ,count} = action.data;
      return {
        chatMsgs: state.chatMsgs.map(msg => {
          if(msg.from===from && msg.to===to && !msg.read) {
            // msg.read = true  // 不能直接修改状态
            return {...msg, read: true}
          }
          //否则就直接返回msg
          return msg;
        }),
        users: state.users,
        unReadCount: state.unReadCount-count
      };
    default:
      return state;
  }
};


export default combineReducers({
  user,
  userList,
  chat
});
