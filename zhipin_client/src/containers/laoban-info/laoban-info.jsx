/*
老板完善信息
*/
import {connect} from 'react-redux';
import React, {Component} from 'react';
import HeaderSelector from '../../components/header-selector/header-selector';
import {NavBar, WingBlank, List, InputItem, TextareaItem, Button} from 'antd-mobile';
import {updateUser} from '../../redux/actions';
import {Redirect} from 'react-router-dom';

class LaobanInfo extends Component {
  state = {
    header: '',  //头像名称 ，得到一个名称即可   
    info: '',
    post: '',
    salary: '',
    company: '',
  };
  setHeader = (header) => {
    this.setState({header})
  };
  handleChange = (type, val) => {
    this.setState({
      [type]: val
    });
    // console.log(this.state);
  };

  render() {
    /*注意这里经常忘记user中的这个属性--然后这里是用容器组件获得的状态，是挂在this.props上的*/
    const {header} = this.props.user;
    if (header) {
      //已经完善了信息
      return <Redirect to='/laoban'/>
    }
    return (
      <div style={{backgroundColor: 'white'}}>
        <NavBar>老板完善信息</NavBar>
        <HeaderSelector setHeader={this.setHeader}/>
        <WingBlank>
          <List>
            <InputItem placeholder='输入招聘职位信息' onChange={(val) => {
              this.handleChange('post', val)
            }}>招聘职位: </InputItem>
            <InputItem placeholder='输入公司名称信息' onChange={(val) => {
              this.handleChange('company', val)
            }}>公司名称: </InputItem>
            <InputItem placeholder='输入职位薪资信息' onChange={(val) => {
              this.handleChange('salary', val)
            }}>职位薪资: </InputItem>
            <TextareaItem title="职位要求: " rows={3} placeholder='输入职位要求信息等' onChange={(val) => {
              this.handleChange('info', val)
            }}/>
            <Button type="primary" onClick={() => {
              this.props.updateUser(this.state)
            }}>保&nbsp;&nbsp;&nbsp;&nbsp;存</Button>
          </List>
        </WingBlank>
      </div>
    );

  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser}
)(LaobanInfo);