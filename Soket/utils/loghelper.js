const log4js = require('log4js');
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
module.exports = logger;