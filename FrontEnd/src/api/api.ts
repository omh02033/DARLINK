import axios from "axios";
import { toast } from "react-toastify";
import { getCookie } from "api";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACK_URL,
  timeout: 5000
});

api.interceptors.request.use((config: any) => {
  const token = getCookie('token');
  if(token)
    config.headers['Authorization'] = token;
  return config;
}, err => {
  toast.error("서버로 전송중 에러가 발생했어요.\n나중에 다시 시도해주세요.");
  return Promise.reject(err);
});

api.interceptors.response.use(res => {
  if(res.status === 200) return res;
  if(res.data.message) return toast.warning(res.data.message);
  return toast.error("서버에서 에러가 발생했어요.\n나중에 다시 시도해주세요.");
}, err => {
  if(err.response.data.message) toast.warning(err.response.data.message);
  else toast.error("서버에서 에러가 발생했어요.\n나중에 다시 시도해주세요.");
  return Promise.reject(err);
});

export default api;