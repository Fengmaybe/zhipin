/*
底部导航UI组件--他要获取navList，引入withRouter
*/

import React,{Component} from 'react';
import {TabBar} from 'antd-mobile';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

class NavFooter extends Component {
  static propTypes = {
    navList:PropTypes.array.isRequired,
    unReadCount: PropTypes.number.isRequired
  };
  render(){
    const navList =  this.props.navList.filter(nav => !nav.hide);
    return (
      <TabBar>
        {
          /*将数组映射为标签数组*/
          navList.map(nav => (
            <TabBar.Item
            key={nav.path}
            badge={nav.path === '/message' ? this.props.unReadCount : 0}
            title={nav.text}
            icon={{uri:require(`./images/${nav.icon}.png`)}}
            selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`)}}
            selected={this.props.location.pathname===nav.path}
            onPress={()=>this.props.history.replace(nav.path)}
            />
          ))
        }
      </TabBar>
    )
  }
}

export default withRouter(NavFooter);   //让非路由组件可以访问到路由组件的API,从react-route-DOM中


