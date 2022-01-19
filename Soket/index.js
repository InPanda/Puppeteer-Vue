process.chdir(__dirname);
const WebSocketServer = require("ws").Server;
const BASE_URL = require("./config/config.json");
const Queue = require("./utils/queue");
const BrowserHelper = require("./utils/browserHelper");
const { fixPages, STATUS_CODE } = require("./server/page");
const log4js = require("log4js");
log4js.configure({
  appenders: {
    cheese: {
      type: "file",
      filename: "error.log",
      keepFileExt: true,
      maxLogSize: 1024 * 1024 * 4
    }
  },
  categories: {
    default: {
      appenders: ["cheese"],
      level: "error"
    }
  }
});

const logger = log4js.getLogger("capture");

(async function() {
  let socket = null,
    taskQueue = new Queue(),
    bh = new BrowserHelper(),
    isconnectionClosed = false,
    lowlimited = 0; // 取证需求最小限度。当小于50条取证需求时，主动发送消息告知推送截图需求过来。

  let timer = setTimeout(async () => {
      if (bh.browser) {
        await bh.destroyBrowser();
      }
    }, 10 * 60 * 1000),
    loopfunction = async () => {
      while (true) {
        try {
          if (socket != null && taskQueue.size <= lowlimited) {
            // 取证需求最小限度。当小于50条取证需求时，主动发送消息告知推送截图需求过来。
            socket.send(
              JSON.stringify({
                status: STATUS_CODE.CONNECTED,
                postdata: true
              })
            );
          }
          await handleMessage();
          await sleep(3000);
          if (!timer) {
            timer = setTimeout(async () => {
              if (bh.browser) {
                await bh.destroyBrowser();
              }
            }, 10 * 60 * 1000);
          }
        } catch (error) {
          logger.error(error);
        }
      }
    },
    loop = new Promise(loopfunction),
    wss = new WebSocketServer({
      port: BASE_URL.webSocketUrl.split(":").slice(-1)[0]
    });

  // 全局异常处理
  process.on("uncaughtException", ex => {
    loop = new Promise(loopfunction);
    logger.error(`uncaughtException(全局异常：)${ex}`);
  });

  wss.on("connection", function(ws) {
    logger.error(`websocket 已连接`);
    isconnectionClosed = false;
    socket = ws;
    const responseMsg = {
      status: STATUS_CODE.CONNECTED,
      postdata: true
    };
    ws.send(JSON.stringify(responseMsg));
    ws.on("message", function(message) {
      try {
        const links = JSON.parse(message);
        taskQueue.enqueue(links);
      } catch (error) {
        logger.error(`接收数据存入队列异常：${error}`);
        let errMsg = {
          status: STATUS_CODE.DATA_ERROR,
          message: "数据格式错误"
        };
        ws.send(JSON.stringify(errMsg));
      }
    });
  });

  wss.on("close", () => {
    isconnectionClosed = true;
    logger.error(`websocket 已断开`);
  });

  wss.on("error", msg => {
    if (msg) {
      isconnectionClosed = true;
      logger.error(`链接异常：${msg}`);
    }
  });

  function sleep(miniscd) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, miniscd);
    });
  }

  /**
   * 处理信息
   */
  async function handleMessage() {
    // 如果链接已关闭，则暂停处理
    if (isconnectionClosed || taskQueue.size <= 0) {
      await sleep(2000);
      return;
    }

    if (!bh.browser) await bh.init();

    let pages = bh.getFreePages();
    let size = taskQueue.size;
    let count = pages.length >= size ? size : pages.length;

    if (count === 0) {
      await sleep(2000);
      return;
    }

    clearTimeout(timer);
    timer = null;

    for (let i = 0; i < count; i++) {
      // 获取CPU使用率
      let CPUUsage = await bh.getCPUUsage();
      if (CPUUsage > 0.9) {
        continue;
      }
      pages[i].isUsing = true;
      let links = taskQueue.dequeue();
      new Promise(async (resolve, reject) => {
        try {
          await fixPages(socket, pages[i].pageObj, links, logger);
          pages[i].isUsing = false;
          resolve();
        } catch (error) {
          logger.error(`取证时发生异常：${error}`);
          let response = {
            id: links.id,
            status: STATUS_CODE.FAIL
          };
          ws.send(JSON.stringify(response));
          resolve();
        }
      });
    }
    // await Promise.race(promiseArr); // 无需等待，加快取证速度。
  }
})();
