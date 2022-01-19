# 督证通网页取证服务说明

## 项目描述
> 该服务是基于websocket + puppeteer进行开发的服务。
>
> 对websocket收到的页面截图请求数据进行处理，使用puppeteer对目标网页链接进行全页面截图、源代码提取，并将结果存储到请求中指定的路径中。
>
> 该服务中websocket使用ws模块创建websocket实例。

## 目录结构说明
```
|-- SOKET
    |-- index.js                        入口文件
    |-- package.json                    webpack配置文件
    |-- config                          websocket配置文件
    |   |-- config.json                 websocket服务端地址配置json
    |-- result                          服务测试数据生成目标路径
    |-- server                          业务逻辑模块
    |   |-- page.js                     页面截图及源码提取业务逻辑
    |   |-- socket.js                   web端发送测试请求文件
    |-- utils                           工具类模块
        |-- browserHelper.js            创建浏览器的工具类
        |-- queue.js                    创建队列的工具类
```

## nodejs环境说明：
> 由于此截图服务会被java服务接管，java服务会判断此截图服务使用存活可用，其中发现不可用时会杀掉此服务并重启，为了不影响其它nodejs程序，需要独立一个nodejs程序环境，且将node.exe重命名为 **`dzt-node.exe`** 以此进行区分。

## websocket服务端地址配置json文件说明
`SOKET/config/config.json`
```javascript
{
  // websocket服务端地址
  "webSocketUrl": "ws://192.168.0.137:9669"
}
```
> 备注：
>
> 项目中创建websocket服务时，直接在该配置文件中进行字符串截取，从其中提取出端口号，在实例化ws对象时，不需要额外指定其端口号。

## 需要的环境
- Node & NPM

## 安装依赖
```sh
npm install
```

## 运行
```sh
npm start
```

## web端发送测试请求
1. 启动服务。
2. 在web页面中引入`SOKET/server/socket.js`中的`sendMsgToSocket`方法并调用。
3. 在测试数据中指定的存储路径中查看测试结果(如：`SOCKET/result`)。

## 测试数据示例：

```js
const str = `[
  {"id":1001,"url":"https://www.baidu.com/s?ie=UTF-8&wd=puppeteer%20%E4%BB%A5%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E5%BD%A2%E5%BC%8F%E6%89%93%E5%BC%80","save_path":"D:/DuZhengTong/Soket/result","type":1},
  {"id":1002,"url":"https://item.gome.com.cn/A0006657113-pop8013323033.html?intcmp=box80-0-1_2_0a70ae2621011911330320","save_path":"D:/DuZhengTong/Soket/result","type":0},
  {"id":1003,"url":"https://item.gome.com.cn/A0006657113-pop8013323033.html?intcmp=box80-0-1_2_0a70ae2621011911330320","save_path":"D:/DuZhengTong/Soket/result","type":0},
  {"id":1004,"url":"https://item.gome.com.cn/A0006657113-pop8013323033.html?intcmp=box80-0-1_2_0a70ae2621011911330320","save_path":"D:/DuZhengTong/Soket/result","type":0}
]`
```
### 测试数据字段说明
1. `id` : 截图请求的唯一ID.
2. `url` : 目标网页链接.
3. `save_path` : 截图结果存储路径.
4. `type` : 截图模式：0 - PC端模式网页截图, 1 - 手机端模式网页截图.