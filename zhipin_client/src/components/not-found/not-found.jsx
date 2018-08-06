import React,{Component} from 'react';
import {Button,WingBlank,WhiteSpace} from 'antd-mobile';

class NotFound extends Component {
  render(){
    return (
     <WingBlank>
       <WhiteSpace />
       <h2 style={{textAlign:'center'}}>上帝，页面没有找到哇</h2>
       <WhiteSpace />
       <Button type="primary" icon='loading' onClick={()=>{this.props.history.replace('/')}}>点我回主页</Button>
     </WingBlank>
    )
  }
}

export default NotFound;