/*
大神完善信息
*/
import {connect} from 'react-redux';
import React,{Component} from 'react';
import HeaderSelector from '../../components/header-selector/header-selector';
import {NavBar,WingBlank,List,InputItem,TextareaItem,Button} from 'antd-mobile';
import {updateUser} from '../../redux/actions';
import {Redirect} from 'react-router-dom';

class DashenInfo extends Component {
  state = {
    header: '', // 头像名称
    info: '',  // 个人简介
    post: '',  // 求职岗位
  };
  setHeader = (header) => {
    this.setState({header})
  };
  handleChange = (type,val)=>{
    this.setState({
      [type]:val
    });
  };
  render(){
    const {header} = this.props.user;
    if(header){
      //已经完善了信息
      return <Redirect to='/dashen'/>
    }
    return (
      <div style={{backgroundColor:'white'}}>
        <NavBar>大神完善信息</NavBar>
        <HeaderSelector setHeader={this.setHeader}/>
        <WingBlank>
          <List>
            <InputItem placeholder='输入您的求职岗位信息' onChange={val=>{this.handleChange('post',val)}}>求职岗位: </InputItem>
            <TextareaItem title='个人介绍:' rows={3} onChange={val=>{this.handleChange('info',val)}}/>
            <Button type='primary' onClick={()=>{this.props.updateUser(this.state)}}>保&nbsp;&nbsp;&nbsp;&nbsp;存</Button>
          </List>
        </WingBlank>
      </div>
    );

  }
}

export default connect(
  state => ({user:state.user}),
  {updateUser}
)(DashenInfo);