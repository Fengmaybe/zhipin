
/*使用mongoose操作mongodb的测试文件
1. 连接数据库
  1.1. 引入mongoose
  1.2. 连接指定数据库(URL只有数据库是变化的)
  1.3. 获取连接对象
  1.4. 绑定连接完成的监听(用来提示连接成功)
2. 得到对应特定集合的Model
  2.1. 字义Schema(描述文档结构)
  2.2. 定义Model(与集合对应, 可以操作集合)
3. 通过Model或其实例对集合数据进行CRUD操作
  3.1. 通过Model实例的save()添加数据
  3.2. 通过Model的find()/findOne()查询多个或一个数据
  3.3. 通过Model的findByIdAndUpdate()更新某个数据
  3.4. 通过Model的remove()删除匹配的数据*/

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/zhipin');
mongoose.connection.on('connected',()=>{
  console.log('数据库链接成功');
});

const userSchema = mongoose.Schema({
  username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密码
  type: {type: String, required: true}, // 用户类型: dashen/laoban
});

const UsersModel = mongoose.model('users',userSchema);

//测试保存
function testSave(){
  const usersModel = new UsersModel({ username: 'lvya',
    password: 1234,
    type: 'dashen',});
  usersModel.save((err,user)=>{
    console.log('save()', err, user);
    /*
    * { _id: 5b4da52ed901931998a175ca,
        username: 'lvya',
        password: '1234',
        type: 'dashen',
        __v: 0 }
    * */
  })
}
//testSave();

//测试查询
function testFind(){
  UsersModel.findOne({username:'lvya1'},(err,user)=>{
    console.log('findOne()', err, user);
  })
  /*findOne如果查到了，那么就是一个对象；如果没有查到，那么就是null*/
  UsersModel.find({username:'lyuya'},(err,user)=>{
    console.log('find()', err, user);
  })
  /*find如果查到了，那么就是一个数组；如果没有查到，那么就是[]*/
}
//testFind();

//测试更新
function testUpload(){
  UsersModel.findByIdAndUpdate({_id:'5b4da52ed901931998a175ca'},{username:'lyuya'},(err,oldData)=>{
    console.log('testUpload()', err, oldData);
  })
}
/*返回的数据是更新前的数据*/
//testUpload();

//测试删除
function testRemove(){
  UsersModel.remove({_id:'5b4da52ed901931998a175ca'},(err,user)=>{
    console.log('testRemove()', err, user);
  })
}
// testRemove();
//返回的是这个数据  testRemove() null { ok: 1, n: 1 }OK表示已经成功删除一条。n表示已经找到移动1条。





