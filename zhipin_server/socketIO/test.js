module.exports =  (server) => {
  // 得到IO对象
  const io = require('socket.io')(server);
  // 监视连接(当有一个客户连接上时回调)
  io.on('connection', function (socket) {   //2.服务器监听到浏览器连接的事件，触发回调
    console.log('soketio connected');
    // 绑定sendMsg监听, 接收客户端发送的消息
    socket.on('sendMsg', function (data) {  //4.服务器监听到sendMsg事件，触发回调，接受浏览器发来的数据
      console.log('服务器接收到浏览器的消息', data);
      // 向客户端发送消息(名称, 数据)
      socket.emit('receiveMsg', data.name + '_' + data.date);  //5.服务器主动发给浏览消息
      console.log('服务器向浏览器发送消息', data)
    })
  })
}