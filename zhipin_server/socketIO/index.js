//别忘记解构了！！！会报一个错误，集合对象ChatModel不是一个构造器
const {ChatModel} = require('../db/models');

module.exports =  (server) => {
  // 得到IO对象
  const io = require('socket.io')(server);
  // 1.监视连接
  io.on('connection', function (socket) {
    console.log('1.服务器和浏览器已经连接完成了');
    //2.接收浏览器发过来的信息
    socket.on('sendMsgToServer',({content,from,to})=>{
      console.log('2.接收浏览器->服务器的信息', {content,from,to});
      //2.1保存到数据库--因为断线可以发送信息
      const chat_id = [from,to].sort().join('_');
      const create_time = Date.now();
      new ChatModel({chat_id,create_time,content,from,to}).save((err,chatMsg) => {
        //2.2保存完成后, 向所有连接的客户端发送消息（全局发，用io）chatMsg
        io.emit('sendMsgToBrowser',chatMsg);
        console.log('3.服务器->浏览器器的信息', chatMsg);
      });
    })

  })
};