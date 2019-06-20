import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  });
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  });
}
// ------------------------------------------------
export function doLogin(data) {
  return request({
    url: '/indexV2',
    method: 'post'
    // params: {  }
  });
}
// export function doLogin(data) {
//   return request({
//     url: '/doLogin',
//     method: 'post',
//     data
//   });
// }
