import axios from "axios";
// const endpoint = "http://localhost:8080/api";
const endpoint ="https://rookies-shops.herokuapp.com/api"
export async function get(url) {
  return await axios.get(endpoint + url,{
    headers: { 'Content-type': 'application/json'},
    
    
    });
}
export async function getWithToken(url, token) {
  return await axios.get(endpoint + url, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
export async function post(url, body) {
  return  await axios.post(endpoint + url, body);
}
export async function postWithToken(url, body, token) {
  return  await axios.post(endpoint + url, body,{
    headers: { Authorization: `Bearer ${token}`,'Content-type': 'application/json'},
    
    
    });
}
export async function patchWithToken(url, body, token) {
  return  await axios.patch(endpoint + url, body,{
    headers: { Authorization: `Bearer ${token}`,'Content-type': 'application/json'},
    
    
    });
}
export async function patch(url, body) {
  return await axios.patch(endpoint + url, body);
}
export async function put(url, body) {
  return await axios.put(endpoint + url, body);
}
export async function del(url, token) {
  return await axios.delete(endpoint + url, {
    headers: { Authorization: `Bearer ${token}`
  }
  });
}
