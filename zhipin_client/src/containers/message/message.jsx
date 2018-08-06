/*
对话消息列表组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'

const Item = List.Item;
const Brief = Item.Brief;

class Message extends Component {
  /*
  1. 先创建一个用于保存所有lastMsg对象容器: lastMsgObjs, key是chat_id, value是msg,
  2. 遍历chatMsgs, 得到msg, 判断msg是否是对应聊天的最后一个, 如果是保存到lastMsgObjs
  3. 得到lastMsgObjs的value组成的数组: lastMsgs
  4. 对lastMsgs按create_time进行降序
   */
  //开始定义getLastMsgs函数--后面调用要用this
  getLastMsgs = (chatMsgs,meId) => {
    //1.我只与A B C聊了天，那么这个对象里应该存放三个属性，属性名为chat_id（我与A聊天的很多内容都是只有这个唯一表示chat_id）属性值为msg(后台返回来一条消息的对象)
    const lastMsgObjs = {};
    //2.遍历chatMsgs这个数组，获取到每个msg对象。判断其是否是最后一个
    chatMsgs.forEach(msg => {
      //遍历哪些才是我需要的最后一条呢？这是未读的消息的逻辑
      //一就是read值为FALSE  二就是msg.to===meId是发给我的
      if(!msg.read && msg.to===meId) {
        //对于我来说，有条未读消息
        msg.unReadCount = 1;
      } else {
        msg.unReadCount = 0
      }
      //以下是获取msg对象的逻辑（最后一个）
      const chatId = msg.chat_id;
      //我对象里只会存放一个chatId的数据把（也就是我只会存一条我与A之间的消息）
      //检查这个对象里有还是没有chatid的消息对象msg  lastMsg可能有可能没有
      const lastMsg = lastMsgObjs[chatId];
      if(!lastMsg){
        //如果没有，那么就把此时的msg插入到我lastMsg中
        //添加到对象容器中，key为chatid(唯一值)  value为遍历数组中的某一个对象
        lastMsgObjs[chatId] = msg;
      }else{
        //有，那么就要与此时的msg进行比较，晚的就添加。
        //走到这里，说明之前一定产生了lastMsg，故在计算未读数量时要加上

        //上逻辑（为了未读数量）
        const unReadCount = lastMsg.unReadCount + msg.unReadCount;
        if(msg.create_time>lastMsg.create_time){
          //此时的msg比之前的消息还玩，替换
          lastMsgObjs[chatId] = msg
        }
        //否则，还是之前的lastMsg
        //下逻辑（为了未读数量）保存到最新的lastMsg中
        lastMsgObjs[chatId].unReadCount = unReadCount
      }
    });

      //3.得到lastMsgObjs的value值拼成的数组为：lastMsgs
    const lastMsgs = Object.values(lastMsgObjs);

      //4. 对lastMsgs按createtime去降序-->这样显示遍历的时候就是将最新的数据呈现到最开头
    lastMsgs.sort((msg1, msg2) => {
      return msg2.create_time - msg1.create_time  //降序
    })

    return lastMsgs


  };
  render() {
    const {users,chatMsgs} = this.props.chat;
    const {user} = this.props;
    const meId = user._id;
    //通过一个函数得到每个聊天的lastMsg组成的数组
    const lastMsg = this.getLastMsgs(chatMsgs,meId);
    return (
      <List style={{marginTop:50,marginBottom:50}}>
        <QueueAnim type='left' delay={10}>
        {
          lastMsg.map(msg => {
            //两种情况，一种是别人发的，一种是自己发的。计算出targetId是谁
            let targetId;
            if(msg.to === meId){
              //别人发给我的-->目标显示的是别人
              targetId = msg.from;
            }else{
              targetId = msg.to;
            }
            //去渲染信息--头像以及名字
            const {header,username} = users[targetId];
            return (
              <List.Item
                key = {msg._id}
                extra={<Badge text={msg.unReadCount}/>}
                thumb={require(`../../assets/images/${header}.png`)}
                arrow='horizontal'
                onClick={()=> this.props.history.push(`chat/${targetId}`)}
              >
                {msg.content}
                <List.Item.Brief>{username}</List.Item.Brief>
              </List.Item>
            )
          })
        }
        </QueueAnim>

      </List>
    )
  }
}

export default connect(
  state => ({chat:state.chat,user:state.user}),
  {}
)(Message);