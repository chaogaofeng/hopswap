import axios from "axios";
import { Message } from "element-ui";
import router from "@/router";
let http = axios.create({
  baseURL: "http://152.32.210.47:8083",
  timeout: 10000,
});

http.interceptors.request.use(
  (config) => {
    if (localStorage.token) {
      config.headers.authorization = localStorage.token;
    }
    return config;
  },
  (err) => {
    console.error("请求失败", err);
  }
);

http.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.headers.authorization) {
        localStorage.token = response.headers.authorization;
      }
      switch (response.data.code) {
        case 0:
          return response.data;
        case 1003:
          Message("请重新登录");
          localStorage.clear();
          router.push({ name: "login" });
          break;
        default:
          return response.data;
      }
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.response.status) {
      return Promise.reject(error.response);
    }
  }
);
export default http;
