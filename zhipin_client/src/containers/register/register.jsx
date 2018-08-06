import React,{Component} from 'react';
import {
  NavBar,
  List,
  WhiteSpace,
  WingBlank,
  InputItem,
  Radio,
  Button
} from 'antd-mobile';
import Logo from '../../components/logo/logo'
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {register} from '../../redux/actions'

class Register extends Component {
  state = {
    username:'',
    password:'',
    rePassword:'',
    type:'dashen'
  };
  handleChange = (type,val)=>{
    this.setState({
      [type]:val
    })
  };
  goLogin = ()=>{
    this.props.history.replace('./login');
  };
  register = ()=>{
    this.props.register(this.state);
  };
  render(){
    let {type} = this.state;
    let {msg,redirectTo} = this.props.user;
    console.log(msg, redirectTo);
    //只要重定向状态一改变就会触发render重新渲染
    if(redirectTo){
      console.log('进来了重定向的逻辑');
      return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>直聘注册</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            {msg ? <p className='error-msg'>{msg}</p> : <p className='error-msg'>&nbsp;</p>}
            <WhiteSpace/>
            <InputItem placeholder='请输入用户名' onChange={(val)=>this.handleChange('username',val)}>用户名: </InputItem>
            <WhiteSpace/>
            <InputItem placeholder='请输入密码' type='password' onChange={(val)=>this.handleChange('password',val)}>密码: </InputItem>
            <WhiteSpace/>
            <InputItem placeholder='请再次输入密码' type='password' onChange={(val)=>this.handleChange('rePassword',val)}>确认密码: </InputItem>
            <WhiteSpace/>
            <List.Item>
              <span>注册类型: </span>&nbsp;&nbsp;
              <Radio checked={type === 'dashen'} onChange={()=>this.handleChange('type','dashen')}>大神</Radio>&nbsp;&nbsp;&nbsp;
              <Radio checked={type === 'laoban'} onChange={()=>this.handleChange('type','laoban')}>老板</Radio>
            </List.Item>
            <WhiteSpace/>
            <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;&nbsp;&nbsp;册</Button>
            <WhiteSpace/>
            <Button onClick={this.goLogin}>已有账号</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {register}
)(Register);