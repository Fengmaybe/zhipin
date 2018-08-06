const express = require('express');
const router = express.Router();
const md5 = require('blueimp-md5');
const {UsersModel,ChatModel} = require('../db/models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//注册的路由
router.post('/register',(req,res)=>{
  const {username,password,type} = req.body;
  //从数据库找username
  UsersModel.findOne({username},(err,user)=>{
    //如果找到user是{··}，如果没有找到user是null
    if(user){
      //成功找到这个数据-->此用户名已存在
      res.send({
        "code": 1,
        "msg": "此用户已存在"
      });
    }else{
      //数据库无此数据-->可以注册-->保存到数据中（密码加密保存）
      new UsersModel({username, password:md5(password), type}).save((err,user)=>{
        //保存成功-->返回响应和返回浏览器一个cookie
        res.cookie('use_id',user._id,{maxAge:1000*3600*24*7});
        res.send({
          "code": 0,
          "data": {_id:user._id,username,type}
        });

      });
    }
  })
});

//登陆的路由
router.post('/login',(req,res)=>{
  const {username,password} = req.body;
  UsersModel.findOne({username,password:md5(password)},{password:0,__v:0},(err,user)=>{
    if(user){
      //用户找到了，可以登录，登录成功-->加上返回响应的cookie
      res.cookie('use_id',user._id,{maxAge:1000*3600*24*7});
      res.send({
        "code": 0,
        "data": user
      });
    }else{
      //user是null-->没有这个用户-->用户名或密码错误
      res.send({
        "code": 1,
        "msg": "用户名或密码错误"
      });
    }
  })
});

//更新的路由
router.post('/update',(req,res)=>{
//拿到cookie的值use_id
  const use_id = req.cookies.use_id;
  if(!use_id){
    //没有登录过，返回消息
    res.send( {code: 1, msg: "请先登陆"}
    )
  }
  //否则更新操作
  UsersModel.findByIdAndUpdate({_id:use_id},req.body,(err,oldUser)=>{
    const {_id, username, type} = oldUser;
    // node端 ...不可用
    // const data = {...req.body, _id, username, type}
    // 合并用户信息
    const updatedUser = Object.assign(req.body,{_id, username, type});
    res.send({code:0,data:updatedUser});
  })


});

//获取用户信息-->根据cookie获取对应的user
router.get('/user',(req,res)=>{
  const {use_id} = req.cookies;
  if(!use_id){
    //cookies中没有use_id则返回错误响应
    return res.send( {code: 1, msg: "请先登陆"});
  }
  UsersModel.findOne({_id:use_id},{password:0,__v:0},(err,user)=>{
    return res.send({code: 0, data: user});
  });
});

//获取用户列表
router.get('/userlist',(req,res)=>{
  const {type} = req.query;
  UsersModel.find({type},{password:0,__v:0},(err,users)=>{
    return res.json({code:0,data:users});
  })
});

//获取当前用户的聊天消息列表
router.get('/msglist',(req,res)=>{
    //获取到cookie的中use_id
  const {use_id} = req.cookies;
  //1.查询得到的所有user文档数据--保存到对象中，属性名为_id 属性值为（name和header）
  UsersModel.find({},{password:0,__v:0},(err,userDocs)=>{
    const users = {};
    userDocs.forEach((doc)=>{
      users[doc._id] = {username:doc.username,header:doc.header}
    });
    //2.查询到所有有关cookie中的use_id的（收 发）的所有消息列表
    //{from: use_id}是当前用户发的   {to: use_id}是当前用户接受的消息
    ChatModel.find({'$or': [{from: use_id}, {to: use_id}]},{__v:0},(err,chatMsgs)=>{
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据-->当前用户收和发
      //user是对象---chatMsg是find查找的数组
      console.log('我可以读到users的值？？',users);
      res.send({code: 0, data: {users, chatMsgs}});
    })
  });

});


//修改指定消息为已读   get post（操作数据库，有参数） 微妙区别
router.post('/readmsg',(req, res) =>{
  // 此时post请求是带参数from的，现在我要站在我是用户角度思考，我对于消息是否已读？我是to一方，而from一方是别人（可能所有的给我发消息人）
  //from要你传给我，我才知道from---to我有多少未读消息
  const from = req.body.from;
  const to = req.cookies.use_id;
  // {$set:{read:true}}  ???
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true},  (err, doc) => {
    console.log('/readmsg--更新返回的查找结果对象：doc', doc);
    res.send({code: 0, data: doc.nModified})
  })
});

module.exports = router;
