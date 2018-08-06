import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {WhiteSpace,WingBlank,Card} from 'antd-mobile';
import {withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim'

//用户列表的组件
class UserList extends Component {
  static propTypes = {
    userList:PropTypes.array.isRequired
  };
  render(){
    const userList = this.props.userList.filter(user => user.header);
    return (
      <WingBlank style={{marginTop:50,marginBottom:50}}>
        <QueueAnim type='scale' delay={100}>
        {
          userList.map(user=>(
            <div key={user._id}>
              <WhiteSpace/>
              <Card onClick={()=>this.props.history.push(`/chat/${user._id}`)}>
                <Card.Header
                  thumb={require(`../../assets/images/${user.header}.png`)}
                  extra={<span>{user.username}</span>}
                />
                <Card.Body>
                  <div>职位：{user.post}</div>
                  {user.company ? <div>公司：{user.company}</div> : null}
                  {user.salary ? <div>月薪：{user.salary}</div> : null}
                  <div>描述：{user.info}</div>
                </Card.Body>
              </Card>
            </div>
          ))
        }
        </QueueAnim>

      </WingBlank>
    )
  }
}

export default withRouter(UserList);

/*
大神                    老板
username                username
password                password
type                    type
header                  header
post                    post
                        company
                        salary

*/