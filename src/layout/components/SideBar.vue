<template>
  <el-menu
    default-active="home"
    class="el-menu-vertical-demo"
    v-model="activePath"
    router
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="home">
      <i class="el-icon-menu"></i>
      <span slot="title">导航二</span>
    </el-menu-item>
    <el-menu-item index="bigScreen">
      <i class="el-icon-setting"></i>
      <span slot="title">导航四</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'SideBar',
  data () {
      return {
          activePath:''
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