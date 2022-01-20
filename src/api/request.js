// request.js
import axios from "axios";
import baseConfig from "./config";
import { getCookie } from "@/utils/index";
import { Message } from "element-ui";
// import store from "@/store";
// import { getToken } from "@/utils/auth";

let baseURL = baseConfig.apiBaseUrl;

/** **** 创建axios实例 ******/
const service = axios.create({
  baseURL: baseURL, // api的base_url
  // baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 60000, // 请求超时时间
  withCredentials: true // 允许携带cookie
});
/** **** request拦截器 ******/
service.interceptors.request.use(config => {
  // 文件下载
  if (config.url === "/excel/downloadUser") {
    config.responseType = "blob";
  }
  // 文件上传
  if (config.url === "record/record") {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    switch (config.method) {
      case "post":
        config.data = JSON.stringify({ ...config.params });
        config.params = {};
        break;
      case "get":
        config.params = { ...config.data };
        break;
      case "restful":
        config.url = `${config.url}/${config.data}`;
        config.method = "post";
        config.data = null;
        break;
      case "restful2":
        config.url = `${config.url}/${config.data[0]}/${config.data[1]}`;
        config.method = "post";
        config.data = null;
        break;
    }
    config.headers["Content-Type"] =
      config.method === "post"
        ? `application/json;charset=UTF-8`
        : `application/x-www-form-urlencoded`;
  }
  if (getCookie("userInfo") && JSON.parse(getCookie("userInfo")).token) {
    config.headers["token"] = JSON.parse(getCookie("userInfo")).token;
  }
  return config;
});
/** **** respone拦截器 ******/
service.interceptors.response.use(
  response => {
    // 根据后端提供的数据进行对应的处理
    if (response.config.responseType === "blob") {
      return Promise.resolve(response.data);
    }
    if (response.data.status === 0) {
      // 后端返的状态码
      return Promise.resolve(response.data);
    } else {
      if (response.data.status === 1) {
        // 失败
         return Promise.resolve(response.data);
      } else if (response.data.status === -100) {
        // 登录失效
        Message({
          message: response.data.msg || "Error",
          type: "error",
          duration: 5 * 1000
        });
        return Promise.resolve(response.data);
      } else if (response.data.status === -101) {
        // 账号已被冻结
        Message({
          message: response.data.msg || "Error",
          type: "error",
          duration: 5 * 1000
        });
        return Promise.resolve(response.data);
      } else if (response.data.status === 500) {
        return Promise.resolve(response.data);
      } else if (response.data.status === 105) {
        //验证码错误
        return Promise.resolve(response.data);
      }
    }
  },
  error => {
    // 响应错误处理
    return Promise.reject(error);
  }
);
export default service;
