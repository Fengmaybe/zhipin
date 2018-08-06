/*
抽取的组件：头像信息
*/
import {List,Grid} from 'antd-mobile';
import React,{Component} from 'react';
import PropTypes from 'prop-types';

class HeaderSelector extends Component {
  /*思考：为什么要写在这里？因为在render（）重新渲染-效率低
  * 另外注意一个问题：this的问题
  * */
  constructor(props){
    super(props);
    this.headerList = [];
    for (var i = 0; i < 20; i++) {
      let imgName = '头像'+(i+1);
      this.headerList.push({
        icon:require(`../../assets/images/${imgName}.png`),
        text:imgName
      })
    }
  }
  static propTypes = {
    setHeader:PropTypes.func.isRequired
  };
  state = {
    icon:''  //组件内部自己要用的实时更新状态到本组件上
  };
  //将得到的头像名称传递给父组件，供其改变父组件的状态。
  selectHeader = ({icon,text})=>{
    //1.更新自身状态
      this.setState({icon});
    //2.传递头像名称给父组件
      this.props.setHeader(text);
  };
  render(){
    const {icon} = this.state;
    const showData = icon ?  <span>已选择图像： <img src={icon} alt='header'/> </span> :'请选择头像： ';

    return (
      <List renderHeader={() => showData}>
        <Grid columnNum={5} onClick={this.selectHeader} data={this.headerList}></Grid>
      </List>
    )
  }
}

export default HeaderSelector;