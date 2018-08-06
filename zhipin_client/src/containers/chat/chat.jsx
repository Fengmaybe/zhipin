/*
对话聊天的路由组件
 */
import React, {Component} from 'react'
import {NavBar, List, InputItem,Icon,Grid} from 'antd-mobile'
import {connect} from 'react-redux';
import {sendMsg,readChatMsg} from '../../redux/actions';
import QueueAnim from 'rc-queue-anim'

class Chat extends Component {
  //本地管理的状态
  state = {
    content:'',
    isShowEmoji:false  //是否显示表情框 -- 用状态去决定是否显示是组件化编程的基本思想
  };
  //在constructor定义也是可以的--这个数组的定义是我们需要在渲染页面前用，关键只需要定义一次即可，我们就会想到如何处理这个问题。
  componentWillMount(){
    //定义表情，挂载到实例对象this上这个数组
   /*const emojisString = '😁😁😁😁😂';
   const emojis = [];
    emojisString.split('').forEach(emoji=>{
      console.log(emoji);
      emojis.push({
        text:emoji
      })
    });
    console.log('整个表情包数组，本应该是五个，看看有几个？结果输出了十个，说明其一个表情有两个字符，split出了问题。');
    console.log(emojis);*/
    //一个新数组挂载到了this上，后面可以直接通过this用emojis这个数组

    this.emojis = ['😁', '😃', '😄', '😅','😆', '😉', '😊', '😋','😎','😍','😘','😰','😱','😳','😵','😷','👍','🙈','🙉','🙊','💥','💦','💨','💫','😁', '😃', '😄', '😅','😆', '😉', '😊', '😋','😎','😍','😘','😰','😱','😳','😵','😷','👍','🙈','🙉','🙊','💥','💦','💨','💫']
    this.emojis = this.emojis.map(value => ({text: value}))
    // console.log(this.emojis)

  }

  componentDidMount(){
    //第一次render的初始化
    window.scrollTo(0,document.body.scrollHeight);
  }
  componentDidUpdate(){
    //非第一次渲染，其他render的情况
    window.scrollTo(0,document.body.scrollHeight);
  }

//这是在退出，相当于卸载chat组件后退出。
// 在退出死亡前
  componentWillUnmount (){
    // 更新为已读
    const from = this.props.match.params.userid;
    const to = this.props.user._id;
    this.props.readChatMsg(from, to)
  }

  //表情按钮
  toggleShowEmoji = () => {
    const isShowEmoji = !this.state.isShowEmoji;
    //实时更新状态值
    this.setState({isShowEmoji});
    if(isShowEmoji){
      //本是隐藏，点击一下，要显示，进入显示的界面-->解决不能resize的问题，异步resize事件
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 0);

    }
  };
  //发送按钮
  send = () => {
    //通过socketIO去向服务器发送信息（异步->action中处理）
    //要上交给服务器三个数据
    const from = this.props.user._id;
    const to = this.props.match.params.userid ;
    const content = this.state.content;
    this.props.sendMsg({content,from,to});
    //清空
    this.setState({content:''});
  };
  render() {

    //目标的id-->对方的id-->通过this.props.match.params.userid
    const targetId = this.props.match.params.userid;
    const {users,chatMsgs} = this.props.chat;
    console.log('CE SHATCWASG');
    console.log(this.props.chat.chatMsgs);
    const {user} = this.props;

    if(!users[targetId]){
      //初次targetId,获取数据是异步的，targetId可能还没得到。
      return null;
    }
    //得到的chatMsgs是当前用户与所有的发送的消息，现在过滤的是当前用户与此时指定的目标用户消息
    //通过设计chatId的值去更好的查找过滤掉非chatId值得数据
    const meId = user._id;
    const chatId = [meId,targetId].sort().join('_');
    //对chatMsgs进行过滤得到我与targetId的所有chatMsg的数组‘
    console.log(chatMsgs);
    const showMsgs = chatMsgs.filter(msg => msg.chat_id === chatId);
    //处理对方的头像和名字
    const targetHeader = require(`../../assets/images/${users[targetId].header}.png`);
    const targetUserName = users[targetId].username;
    //处理自己的头像和名字
    const myUserName = user.username;
    const myHeader = require(`../../assets/images/${user.header}.png`);
    return (
      <div id='chat-page'>
        <NavBar
          className= 'fix-top'
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.history.goBack()}>{targetUserName}</NavBar>
        <List  style={{marginBottom:50, marginTop:50}}>
          {/*alpha left right top bottom scale scaleBig scaleX scaleY*/}

            {
              showMsgs.map(msg => {
                if(msg.to === meId){
                  //别人发给我的，显示在列表的左边
                  return (
                    <List.Item
                      key={msg._id}
                      thumb={targetHeader}
                    >
                      {msg.content}
                    </List.Item>
                  )
                }else{
                  //我发给别人的
                  return (
                    <List.Item
                      key={msg._id}
                      className='chat-me'
                      extra={myUserName}
                    >
                      {msg.content}
                    </List.Item>
                  )
                }
              })
            }


        </List>

        <div className='am-tab-bar'>
          <InputItem
            onChange={(val)=>this.setState({content:val})}
            onFocus={() => this.setState({isShowEmoji: false})}
            value = {this.state.content}
            placeholder="请输入发送内容"
            extra={
              <span>
                <span onClick={this.toggleShowEmoji} style={{marginRight:10}}>😃</span>
                <span onClick={this.send}>发送</span>
              </span>
            }
          />
          {
            this.state.isShowEmoji ? (
              <Grid
                data={this.emojis}
                columnNum={8}
                carouselMaxRow={4}
                isCarousel={true}
                onClick={(item) => {
                  this.setState({content: this.state.content + item.text})
                }}
              />
            ) : null
          }
        </div>
      </div>
    )
  }
}
export default connect(
  state => ({user:state.user,chat:state.chat}),
  {sendMsg,readChatMsg}
)(Chat)