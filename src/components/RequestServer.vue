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
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="截图路径">
        <el-input
          type="textarea"
          v-model="form.save_path"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="connectServer"
        >连接服务</el-button>
        <el-button>断开服务</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script>
export default {
  name: 'RequestServer',
  data() {
    return {
      form: {
        id: '001',
        url: 'https://item.jd.com/10031792658506.html',
        save_path: 'result',
      }
    }
  },
  methods: {
    connectServer() {
      const str = new Array(1).fill(this.form)
      if ("WebSocket" in window) {
        let ws = new WebSocket('ws://127.0.0.1:9669');
        ws.onopen = function () {
          ws.send(JSON.stringify(str));
        };
        ws.onmessage = (evt) => {
          let received_msg = evt.data;
          this.$message({
            type: "success",
            message: received_msg,
            icon: "success",
            top: "30px",
            timeOut: 8,
            align: "left",
          })
        };
        ws.onclose = function () {
          console.log("连接已关闭...");
        };
      } else {
        console.log("您的浏览器不支持 WebSocket!");
      }
    }
  }
}
</script>
<style>
.container {
  justify-content: center;
}
</style>