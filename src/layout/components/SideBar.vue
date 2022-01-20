<template>
  <el-menu
    :default-active="activePath"
    class="el-menu-vertical-demo"
    v-model="activePath"
    router
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="home">
      <i class="el-icon-menu"></i>
      <span slot="title">网页截图服务</span>
    </el-menu-item>
    <el-menu-item index="bigScreen">
      <i class="el-icon-setting"></i>
      <span slot="title">大屏展示</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'SideBar',
  data() {
    return {
      activePath: 'home'
    }
  },
  mounted() {
    this.activePath = this.$route.path;
  },
}
</script>

<style lang='scss' scoped>
.el-menu-vertical-demo {
  height: 100%;
}
</style>