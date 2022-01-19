/**
 * 计算两个时间戳之间的时间差 多少天时分秒
 * @param {*} timestamp1 时间戳1
 * @param {*} timestamp2 时间戳2
 */
export function timeSpend(timestamp1, timestamp2) {
  if (timestamp1 && timestamp2) {
    const time = (Math.abs(timestamp1 - timestamp2)) / 1000;  // 毫秒/1000
    const days = parseInt(time / 86400); // 天  24*60*60 
    const hours = parseInt(time / 3600) - 24 * days;    // 小时 60*60 总小时数-过去的小时数=现在的小时数 
    const minutes = parseInt(time % 3600 / 60); // 分 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
    const seconds = parseInt(time % 60);  // 以60秒为一整份 取余 剩下秒数
    do {
      if (days !== 0) {
        return days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
      }
      if (hours !== 0) {
        return hours + "小时" + minutes + "分" + seconds + "秒";
      }
      if (minutes !== 0) {
        return minutes + "分" + seconds + "秒";
      }
      if (seconds !== 0) {
        return seconds + "秒";
      }
      return '-'
    } while (0)
  } else {
    return "-"
  }
}

/**
 * unix时间戳转换为时间
 * @param {*} timestamp 时间戳
 */
export function unix2Datetime(timestamp) {
  if (!timestamp) {
    return '';
  } else {
    try {
      const year = new Date(timestamp * 1000).getFullYear();
      const month = ("0" + (new Date(timestamp * 1000).getMonth() + 1)).slice(-2);
      const day = ("0" + new Date(timestamp * 1000).getDate()).slice(-2);
      const hour = ("0" + new Date(timestamp * 1000).getHours()).slice(-2);
      const minutes = ("0" + new Date(timestamp * 1000).getMinutes()).slice(-2);
      const seconds = ("0" + new Date(timestamp * 1000).getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
    } catch (error) {
      throw error;
    }
  }
}

/**
 * 根据数组对象中某字段排序
 * @param {*} property 字段名
 */
export function sortByArrObj(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}

/**
 * 补0
 * @param {*} num 数字
 * @param {*} n 补零后总位数
 */
export function PrefixZero(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}

/**
 * 格式化时间
 * @param {*} time 时间
 * @param {*} boolean 时间格式 true:yyyy-MM-dd hh:mm:ss,false:yyyy-MM-dd
 * @param {*} delimiter 分隔符 - || / || 'zh'
 */
export function formatDate(time, boolean = true, delimiter = "-") {
  if (!time) {
    return '-';
  }
  const date = new Date(time);
  const year = date.getFullYear();
  const month = PrefixZero(date.getMonth() + 1, 2);
  const day = PrefixZero(date.getDate(), 2);
  if (boolean) {
    const hour = PrefixZero(date.getHours(), 2);
    const minute = PrefixZero(date.getMinutes(), 2);
    const second = PrefixZero(date.getSeconds(), 2);

    switch (delimiter) {
      case '-':
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      case '/':
        return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
      case 'zh':
        return `${year}年${month}月${day}日 ${hour}点${minute}分${second}秒`;
      default:
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

  } else {
    switch (delimiter) {
      case '-':
        return `${year}-${month}-${day}`;
      case '/':
        return `${year}/${month}/${day}`;
      case 'zh':
        return `${year}年${month}月${day}日`;
    }
  }
}

/**
 * 获取当前时间
 * @param {*} boolean 时间格式 true:yyyy-MM-dd hh:mm:ss,false:yyyy-MM-dd
 */
export function getNowDate(boolean = true) {
  const now = new Date();
  return formatDate(now, boolean);
}

/**
 * 写cookies
 * @param {*} name 属性名
 * @param {*} value 属性值
 * @param {*} day 失效时间，单位：天
 */
export function setCookie(name, value, day) {
  let exp = new Date();
  exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(JSON.stringify(value)) + ";expires=" + exp.toGMTString();
}

export function setNormalCookie(name, value, day) {
  let exp = new Date();
  exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + value + ";expires=" + exp.toGMTString();
}

/**
 * 读取cookies
 * @param {*} name 属性名
 */
export function getCookie(name) {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) return unescape(arr[2]);
  else return null;
}


/**
 * 删除cookies
 * @param {*} name 属性名
 */
export function delCookie(name) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/**
 * 根据时间字符串获取开始时间戳和结束时间戳
 * @param {*} str 时间字符串
 */
export function str2TimestampRange(str) {
  let res = {
    startTime: "",
    endTime: ""
  }
  if (!str) {
    return res
  }
  str = str.replaceAll("/", "-");
  // yyyy
  const yearReg = new RegExp(/^[1-2]\d{3}$/);
  // yyyy-MM
  const yearMonthReg = new RegExp(/^[1-2]\d{3}(-|\/)((0[1-9])|(1[0-2]))$/);
  // yyyy-MM-dd
  const dateReg = new RegExp(/^[1-2]\d{3}(-|\/)((0[1-9])|(1[0-2]))(-|\/)(0[1-9]|[1-2]\d|3[0-1])$/);
  // yyyy-MM-dd HH:mm:ss
  const datetimeReg = new RegExp(/^[1-2]\d{3}(-|\/)(0[1-9]|1[0-2])(-|\/)(0[1-9]|[1-2]\d|3[0-1])\s(([0-1]\d)|2[0-3])(:[0-5]\d){2}$/);
  do {
    if (datetimeReg.test(str)) {
      if (formatDate(str) === str) {
        res.startTime = new Date(str).getTime();
        res.endTime = new Date(str).getTime();
      }
      break;
    }
    if (dateReg.test(str)) {
      if (formatDate(str, false) === str) {
        res.startTime = new Date(`${str} 00:00:00`).getTime();
        res.endTime = new Date(`${str} 23:59:59`).getTime();
      }
      break;
    }
    if (yearMonthReg.test(str)) {
      res.startTime = new Date(`${str}-01 00:00:00`).getTime();
      if (str.split("-")[1] == "12") {
        res.endTime = new Date(`${str}-31 23:59:59`).getTime();
      } else {
        res.endTime = new Date(new Date(`${str.split("-")[0]}-${parseInt(str.split("-")[1]) + 1}-01 00:00:00`).getTime() - 1000).getTime();
      }
      break;
    }
    if (yearReg.test(str)) {
      res.startTime = new Date(`${str}-01-01 00:00:00`).getTime();
      res.endTime = new Date(`${str}-12-31 23:59:59`).getTime();
      break;
    }
  } while (0)
  return res
}

/**
 * 获取映射关系中所有包含关键词的key（全匹配）
 * @param {Object} map 映射关系 
 * @param {String} kw 关键词
 */
export function getJsonKey(map, kw) {
  let result = "";
  if (kw) {
    for (let key in map) {
      if (map[key] === kw) {
        result = key;
        break;
      }
    }
  }
  return result;
}

/**
 * 字节转换适用大小
 * @param {*} byte 字节大小
 */
export function sizeChange(byte) {
  if (!byte) {
    return "";
  } else {
    let size = "";
    if (byte < 0.1 * 1024) {
      size = byte.toFixed(2) + "B";
    } else if (byte < 0.1 * 1024 * 1024) {
      size = (byte / 1024).toFixed(2) + "KB";
    } else if (byte < 0.1 * 1024 * 1024 * 1024) {
      size = (byte / (1024 * 1024)).toFixed(2) + "MB";
    } else {
      size = (byte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }

    let sizeStr = size + "";
    let index = sizeStr.indexOf(".");
    let dou = sizeStr.substr(index + 1, 2);
    if (dou == "00") {
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
    }
    return size;
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 
 * @param {*} intervals 查询间隔 ms
 * @param {*} selector 选择器
 * @param {*} timeout 超时时间 ms
 * @param {*} callback 回调函数
 */
export async function waitLoaded(intervals, selector, timeout, callback) {
  let end = await new Promise(async (resolve, reject) => {
    let func = new Promise(async (res, rej) => {
      while (
        document.querySelector(selector) == null
      ) {
        await sleep(intervals);
      }
      res(true);
    });
    let timeOut = new Promise((res, rej) => {
      setTimeout(() => {
        res(false);
      }, timeout);
    });
    let result = await Promise.race([func, timeOut]);
    resolve(result);
  });
  if (end) {
    callback()
  }
}

/**
 * JSON转的options数组
 * @param {JSONObject} json json对象
 */
export function json2Options(json) {
  let arr = [];
  for (const key in json) {
    arr.push({
      label: json[key],
      value: key
    })
  }
  return arr;
}

/**
 * base64字符串解码
 * @param {String} base64 
 */
export function decodeBase64(base64) {
  let res = null;
  try {
    res = JSON.parse(decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')))
  } catch (error) {
    throw error
  }
  return res
}
