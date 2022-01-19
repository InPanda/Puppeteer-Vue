const BASE_URL = require("../config/config.json");
const path = require("path");

const str = `[
  {"id":1001,"url":"https://www.baidu.com/s?ie=UTF-8&wd=1","save_path":"D:/DuZhengTong/Soket/result"},
  {"id":1002,"url":"https://www.baidu.com/s?ie=UTF-8&wd=2","save_path":"D:/DuZhengTong/Soket/result"},
  {"id":1003,"url":"https://www.baidu.com/s?ie=UTF-8&wd=3","save_path":"D:/DuZhengTong/Soket/result"}
]`

function sendMsgToSocket() {
  if ("WebSocket" in window) {
    let ws = new WebSocket(BASE_URL.webSocketUrl);
    ws.onopen = function () {
      ws.send(str);
    };
    ws.onmessage = function (evt) {
      let received_msg = evt.data;
      console.log(received_msg);
    };
    ws.onclose = function () {
      console.log("连接已关闭...");
    };
  } else {
    console.log("您的浏览器不支持 WebSocket!");
  }
}

export {
  sendMsgToSocket
}