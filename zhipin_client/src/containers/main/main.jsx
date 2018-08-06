import React,{Component} from 'react';
import {Route,Switch,Redirect} from 'react-router-dom';
import {NavBar} from 'antd-mobile';
import Cookies from 'js-cookie';
import {connect} from 'react-redux';

import LaobanInfo from '../laoban-info/laoban-info';
import DashenInfo from '../dashen-info/dashen-info';
import Laoban from '../laoban/laoban';
import Dashen from '../dashen/dashen';
import Message from '../message/message';
import Personal from '../personal/personal';
import Chat from '../chat/chat';
import NavFooter from '../../components/nav-footer/nav-footer';
import NotFound from '../../components/not-found/not-found';
import {getUser} from '../../redux/actions';
import {getRedirectTo} from '../../utils';


class Main extends Component {
  // 给组件对象添加一个属性navList 后面可以直接访问通过this.navList
  // 通过这个可以判断哪些NavBar上的信息
  navList = [
    {
      path: '/laoban', // 路由路径
      component: Laoban,
      title: '大神列表',
      icon: 'dashen',
      text: '大神',
    },
    {
      path: '/dashen', // 路由路径
      component: Dashen,
      title: '老板列表',
      icon: 'laoban',
      text: '老板',
    },
    {
      path: '/message', // 路由路径
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    },
    {
      path: '/personal', // 路由路径
      component: Personal,
      title: '用户中心',
      icon: 'personal',
      text: '个人',
    }
  ];

  componentDidMount () {
    // 之前有登录，且现在无登录-->发ajax请求，获取用户信息，实现自动登录。
    //这两个条件很重要，因为如果没有的话，我从未登录过，就会去发送ajax请求，检查cookie上面没有id，浪费性能，

    const use_id = Cookies.get('use_id');
    const stateUserId = this.props.user._id;
    if(use_id && !stateUserId){
      //得到用户信息，去实现自动登录,发送异步ajax(不需传递参数，因为直接用cookie的id去判断)
      this.props.getUser();
    }
  }
  render(){
    //1.从未登录过->cookie中没有use_id-->自动跳转到login（如果直接输xxx/message这样就会直接跳转到登录页面上，而非可以直接访问）
      const use_id = Cookies.get('use_id');
      if(!use_id){
        return <Redirect to='/login'/>
      }
    //2.登录过，但目前没有登录（state.user._id是没有的）-->实现自动登录
    const stateUserId = this.props.user._id;
      if(!stateUserId){
        //要实现自动登录-->在render中不能发送ajax请求，故在外面。暂时先不加载任何信息界面。
        return null;
      }
    //3.为自动登录做准备的步骤：当前已经登录过了，且访问的是根路径'/'，则需要跳转到指定的主界面上（laoban/laobanInfo/dashen/dashenInfo）
    let {user} = this.props;
    if(this.props.location.pathname === '/'){
        return <Redirect to={getRedirectTo(user.type,user.header)}/>
    }

    //走到这里，说明就已经登录，可以去显示界面了
    if(user.type === 'dashen'){
      //给大神列表隐藏
      this.navList[0].hide = true;
    }else{
      this.navList[1].hide = true;
    }

    //获取到当前路由和path，进行比较找到数组中的某个对象，将对象的title属性显示到NavBar中
    let currentNav = this.navList.find((nav,index)=> nav.path === this.props.location.pathname);

    // 得到props中的unReadCount
    const unReadCount = this.props.unReadCount

    return (
      <div>
        {currentNav ? <NavBar className='fix-top'>{currentNav.title}</NavBar> : null}
        <Switch>
          <Route path='/laobanInfo' component={LaobanInfo}/>
          <Route path='/dashenInfo' component={DashenInfo}/>
          <Route path='/laoban' component={Laoban}/>
          <Route path='/dashen' component={Dashen}/>
          <Route path='/message' component={Message}/>
          <Route path='/personal' component={Personal}/>
          <Route path='/chat/:userid' component={Chat}/>
          <Route component={NotFound}/>
        </Switch>
        { currentNav ? <NavFooter unReadCount={unReadCount} navList={this.navList}/> : null }
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user,unReadCount:state.chat.unReadCount}),
  {getUser}
)(Main);