import React,{Component} from 'react';
import {connect} from 'react-redux';
import {Result,List,WhiteSpace,Button,Modal} from 'antd-mobile';
import Cookies from 'js-cookie';
import {resetUser} from '../../redux/actions';

 class Personal extends Component {
   logout = ()=>{
     Modal.alert('退出', '你确定要退出登录吗？', [
       { text: '取消', onPress: () => {} },
       { text: '确定', onPress: () => {
           //删除cookie中的use-,use_id是字符串属性类型
           Cookies.remove('use_id');
           //重置state管理状态的user信息
           this.props.resetUser();
           //退完之后，交给main去管理跳转链接
         }
       }
     ])
   };

  render() {
    const {username, header, post, info, salary, company} = this.props.user;
    return (
      <div>
        <Result style={{marginTop:46}}
          img={<img src={require(`../../assets/images/${header}.png`)} style={{width: 50}} alt="header"/>}
          title={username}
          message={company}
        />
        <List renderHeader={() => '相关信息'}>
          <List.Item multipleLine>
            <List.Item.Brief>职位: {post}</List.Item.Brief>
            <List.Item.Brief>简介: {info}</List.Item.Brief>
            {salary ? <List.Item.Brief>薪资: {salary}</List.Item.Brief> :null}
          </List.Item>
        </List>
        <WhiteSpace/>
        <List>
          <Button type='warning' onClick={this.logout}>退出登录</Button>
        </List>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {resetUser}
)(Personal);