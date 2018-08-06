import axios from 'axios';
/*
使用axios封装的ajax请求函数
返回一个promise对象
 */
const ajax = (url,data={},type='GET')=>{
  if(type === 'GET'){
    let queryStr = '';
    Object.keys(data).forEach(key =>{
      queryStr += key + '=' + data[key] + '&';
    });
    if(queryStr){
      queryStr = '?' + queryStr;
      queryStr.substring(0,queryStr.length-1);
    }
    return axios.get(url + queryStr);
  }else{
    return axios.post(url,data);
  }
};

export default ajax;