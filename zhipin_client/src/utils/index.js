/*
* 工具函数
* */
export const getRedirectTo = (type,header)=>{
  //根据type和header去重定向路由-laoban-dashen-laobanInfo-dashenInfo
  let value = '';
  if(type === 'dashen'){
    value = 'dashen';
  }else{
    value = 'laoban';
  }
  if(!header){
    value += 'Info';
  }
  return value;
};