
import React,{Component} from 'react';
import {
  NavBar,
  List,
  WhiteSpace,
  WingBlank,
  InputItem,
  Button
} from 'antd-mobile';

import Logo from '../../components/logo/logo';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {login} from '../../redux/actions'


class Login extends Component {
  state = {
    username:'',
    password:'',
  };
  handleChange = (type,val)=>{
    this.setState({
      [type]:val
    })
  };

  goRegister = ()=>{
    this.props.history.replace('./register');
  };
  login = ()=>{
   this.props.login(this.state);
  };
  render(){
    let {msg,redirectTo} = this.props.user;
    //只要重定向状态一改变就会触发render重新渲染
    if(redirectTo){
      return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>直聘登录</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            {msg ? <p className='error-msg'>{msg}</p> : <p className='error-msg'>&nbsp;</p>}
            <WhiteSpace/>
            <InputItem placeholder='请输入用户名' onChange={(val)=>this.handleChange('username',val)}>用户名: </InputItem>
            <WhiteSpace/>
            <InputItem placeholder='请输入密码' type='password' onChange={(val)=>this.handleChange('password',val)}>密码: </InputItem>
            <WhiteSpace/>
            <Button type="primary" onClick={this.login}>登&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
            <WhiteSpace/>
            <Button onClick={this.goRegister}>没有账号</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {login}
)(Login);
