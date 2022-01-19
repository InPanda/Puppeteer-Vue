import Vue from 'vue'
import { Message } from 'element-ui'

const Message1 = function (options) {
  let dom = document.getElementsByClassName('el-message')
  if (dom.length > 0) {
    return
  }
  if (Vue.prototype.$isServer) return
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  if (!options.duration) {
    options.duration = 1000
  }
  Message(options)
};

['success', 'warning', 'info', 'error'].forEach(type => {
  Message1[type] = options => {
    let dom = document.getElementsByClassName('el-message')
    if (dom.length > 0) {
      return
    }
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return Message1(options)
  }
})
Message1.close = function () {
  Message.close()
}
Message1.closeAll = function () {
  Message.closeAll()
}
export default Message1
