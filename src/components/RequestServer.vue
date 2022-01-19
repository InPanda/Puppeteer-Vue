<template>
  <el-container
    :direction="vertical"
    class="container"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="活动名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input
          type="textarea"
          v-model="form.desc"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="connectServer()"
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
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    connectServer() {
      if ("WebSocket" in window) {
        let ws = new WebSocket('ws://127.0.0.1:9669');
        ws.onopen = function () {
          ws.send(str);
        };
        ws.onmessage = function (evt) {
          let received_msg = evt.data;
          console.log(received_msg);
          document.write(`${received_msg}\n\n`)
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