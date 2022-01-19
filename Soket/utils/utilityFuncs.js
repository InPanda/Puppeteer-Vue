const fs = require('fs');
const path = require('path');

/**
 * 对象深拷贝
 * @param {*} data 被拷贝的对象
 * @returns {Object} o 拷贝结果
 */
function deepClone(data) {
    const t = Array.isArray(data) ? 'array' : typeof data;
    let o;
    if (t === 'array') {
        o = [];
    } else if (t === 'object') {
        o = {};
    } else {
        return data;
    }
    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(deepClone(data[i]));
        }
    } else if (t === 'object') {
        for (let i in data) {
            o[i] = deepClone(data[i]);
        }
    }
    return o;
}

/**
 * 休眠指定毫秒
 * @param {Number} ms 毫秒
 * @returns
 */
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * 获取包含边界值的随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns 包含边界值的区间内的随机数
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}

/**
 * 递归创建多级文件夹
 * @param {*} filepath 文件路径
 */
function createDirSync(filepath) {
    if (fs.existsSync(filepath)) {
        return true;
    } else {
        if (createDirSync(path.dirname(filepath))) {
            fs.mkdirSync(filepath);
            return true;
        }
    }
}

/**
 * 随机生成UUID
 * @param {Number} len 长度
 * @param {Number} radix 基数
 * @returns uuid
 */
function generateUUID(len = 32, radix = 58) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16);
                uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

/**
 * 字符转Unicode编码
 * @param {*} str
 * @returns
 */
function charToUnicode(str) {
    str = String(str);
    let temp;
    let r = '';
    for (let val of str) {
        temp = val.codePointAt(0).toString(16);

        while (temp.length < 4) temp = '0' + temp;

        r += '\\0' + temp;
    }
    return r;
}

/**
 * 选择器转换为符合规范的格式
 * @param {String} selector 选择器
 * @returns 转换后的选择器
 */
function selectorTransform(selector) {
    const reg = /(\.\d)|(#\d)/g;
    if (!selector.match(reg)) selector;
    let specialStrs = selector.match(reg);
    let res = selector;
    for (let i in specialStrs) {
        const str = specialStrs[i];
        const type = str[0];
        const unicode = charToUnicode(str[1]);
        const temp = type + unicode;
        res = selector.replace(str, temp);
    }
    return res;
}

/**
 * 判断字符串是否为合法的url
 * @param {String} str 目标字符串
 * @returns <Boolean> 是否为合法URL
 */
function isUrl(str) {
    const reg = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
    return reg.test(str);
}

/**
 * 递归设置数据存放路径默认路径
 * @param {Array} commandList 指令集
 * @param {*} defaultFolder 数据存放文件夹路径
 */
function setFilePath(commandList, defaultFolder) {
    for (let i = 0; i < commandList.length; i++) {
        const command = commandList[i];
        if (command.name === 'ManuallyIdentify') {
            command.options.filePath = `${defaultFolder}\\${command.options.folderName}`;
        }
        if (command.name === 'Screenshot') {
            command.options.path = `${defaultFolder}\\${command.options.folderName}`;
        }
        if (command.name === 'Loop' && command.options.commandList.length > 0) {
            setFilePath(command.options.commandList, defaultFolder);
        }
    }
}

module.exports = {
    deepClone,
    sleep,
    getRandomIntInclusive,
    createDirSync,
    generateUUID,
    selectorTransform,
    charToUnicode,
    isUrl,
    setFilePath,
};
