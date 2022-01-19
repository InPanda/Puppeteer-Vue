const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const BrowserHeaderHandler = require("../utils/browserHeaderHandler");
const ScreenshotHelper = require("../utils/ScreenshotHelper");

const STATUS_CODE = {
  SUCCESS: 0, // 取证成功
  FAIL: -1, // 取证失败
  TIME_OUT: -2, // 请求超时
  INVALID_URL: -3, // 无效链接
  DATA_ERROR: -4, // 数据格式错误
  CONNECTED: 200, // 已连接到websocket
  CAPTRUE_ERROR: -5 // 截图时发生异常
};

const iPhoneX = puppeteer.devices["iPhone X"];

/**
 * 页面取证
 * @param {*} ws websocket实例
 * @param {*} page page对象
 * @param {*} links 需要处理的链接对象
 */
async function fixPages(ws, page, links, logger) {
  if (
    !fs.existsSync(path.join(path.resolve(__dirname, "../", links.save_path)))
  ) {
    createDirSync(path.join(path.resolve(__dirname, "../", links.save_path)));
  }
  if (links.type === 1) {
    await page.emulate(iPhoneX);
  } else {
    await page.emulate({
      viewport: {
        width: 1920,
        height: 1080,
        isMobile: false,
        hasTouch: false,
        isLandscape: false,
        deviceScaleFactor: 1
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
    });
  }
  if (
    !/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(
      links.url
    )
  ) {
    let response = {
      id: links.id,
      status: STATUS_CODE.INVALID_URL
    };
    ws.send(JSON.stringify(response));
    await page.goto("about:blank");
    return;
  }
  try {
    await page.goto(links.url, {
      // waitUntil: "networkidle0",
      waitUntil: ["networkidle2", "load"],
      timeout: 30000
    });

    const headerHandler = new BrowserHeaderHandler(page);
    await headerHandler.addHeader();

    page.on("dialog", async dialog => {
      await dialog.dismiss();
    });
  } catch (e) {
    logger.error(`page.goto异常：${e},url:${links.url}`);
    let response = {
      id: links.id,
      status: STATUS_CODE.TIME_OUT
    };
    ws.send(JSON.stringify(response));
    await page.goto("about:blank");
    return;
  }

  let title = "";
  try {
    title = (await page.title()).trim();
  } catch (e) {
    logger.error(`获取标题失败，url:${links.url}，错误消息：${e}`);
    title = links.id;
  }
  await getFullPage(page, logger);
  // const sHeight = await getFullPage(page, logger);
  // console.log(sHeight);

  // 淘宝网站删除登录弹窗
  await page.evaluate(() => {
    let loginDialog = document.body.querySelector("div[class*=dialog]");
    if (loginDialog) {
      let isTaobao =
        loginDialog.querySelector("iframe") &&
        loginDialog.querySelector("iframe").src.search("login.taobao.com") !==
          -1;
      if (isTaobao) {
        document.body.removeChild(loginDialog);
      }
    }
  });
  let timeOut = new Promise(res => {
    setTimeout(() => {
      res(false);
    }, 180 * 1000);
  });
  let shot = new Promise(async res => {
    const sPath = `${path.resolve(__dirname, "../", links.save_path)}/${
      links.id
    }.png`;
    const sType = "png";
    const shotHelper = new ScreenshotHelper(page);
    const sRes = await shotHelper.fullPage(sPath, sType);
    if (!sRes) {
      logger.error(`截图异常`);
    }
    res(sRes);
    // try {
    //   await page.screenshot({
    //     path: `${links.save_path}/${links.id}.png`,
    //     fullPage: true
    //   });
    //   res(true);
    // } catch (err) {
    //   logger.error(`截图异常：${err}`);
    //   res(false);
    // }
  });

  let isSuccess = await Promise.race([shot, timeOut]),
    response = null;
  if (isSuccess) {
    response = {
      id: links.id,
      pic: `${links.save_path}${links.id}.png`,
      title,
      status: STATUS_CODE.SUCCESS
    };
  } else {
    response = {
      id: links.id,
      status: STATUS_CODE.CAPTRUE_ERROR
    };
  }

  ws.send(JSON.stringify(response));
  await page.goto("about:blank");
}

/**
 * 递归创建多级文件夹
 * @param {*} filepath 文件路径
 */
function createDirSync(filepath) {
  if (!fs.existsSync(filepath))
    fs.mkdirSync(filepath, {
      recursive: true
    });
}

/**
 * 滚动加载页面，默认滚动1min
 * @param {*} page page对象
 * @param {*} time 超时时间
 */
async function getFullPage(page, logger, time = 60000) {
  try {
    return await page.evaluate(async time => {
      let timer = null;
      let scroll = new Promise(resolve => {
        let totalHeight = 0;
        let distance = 300;
        timer = setInterval(() => {
          let scrollHeight = document.documentElement.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve(scrollHeight);
          }
        }, 400);
      });
      let timeout = new Promise(resolve => {
        setTimeout(() => {
          clearInterval(timer);
          resolve(document.documentElement.scrollHeight);
        }, time);
      });

      let height = await Promise.race([scroll, timeout]);
      return height;
    }, time);
  } catch (e) {
    logger.error(`滚动页面异常：${e}`);
  }
}

module.exports = { fixPages, STATUS_CODE };
