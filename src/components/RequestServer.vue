<template>
  <el-container
    direction="vertical"
    class="container"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="网址">
        <el-input
          placeholder="请输入完整Url,多条网站截图请输入 ;(英文分号)隔开"
          v-model="form.url"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="截图路径">
        <el-input
          placeholder="截图文件存放路径，相对于工程目录"
          v-model="form.save_path"
        ></el-input>
      </el-form-item>
      <el-form-item label="截图类型">
        <el-switch
          style="width:100%"
          v-model="form.isMobile"
          active-text="iphone X"
          inactive-text="web"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="connectServer"
        >连接服务</el-button>
        <el-button @click="closeConnect">断开服务</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script>
import { PrefixZero } from '../utils/utils.js';
export default {
  name: 'RequestServer',
  data() {
    return {
      form: {
        url: '',
        save_path: '',
        isMobile: false
      },
      dataArr: [],
      ws: null
    }
  },
  methods: {
    connectServer() {
      const { url, save_path, isMobile } = this.form
      const url_arr = url.split(';')
      for (let i = 0; i < url_arr.length; i++) {
        const url = url_arr[i];
        this.dataArr.push({
          id: PrefixZero(i + 1, 5),
          url,
          save_path,
          isMobile
        })
      }
      if ("WebSocket" in window) {
        this.ws = new WebSocket('ws://127.0.0.1:9669');
        this.ws.onopen = () => {
          this.ws.send(JSON.stringify(this.dataArr));
        };
        this.ws.onmessage = (evt) => {
          let received_msg = evt.data;
          this.$notify({
            title: '收到socket消息',
            message: received_msg,
            type: 'success'
          });
        };
        this.ws.onclose = function () {
          console.log("连接已关闭...");
        };
      } else {
        console.log("您的浏览器不支持 WebSocket!");
      }
    },
    closeConnect() {
      this.ws.close()
      this.ws = null
      this.$message({
        type: "success",
        message: 'socket已断开',
        icon: "success",
        top: "30px",
        timeOut: 8,
        align: "left",
      })
    }
  }
}
</script>
<style>
.container {
  justify-content: center;
}
</style>