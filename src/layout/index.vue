<template>
  <div class="app-wrapper">
    <div class="header">
      <side-bar />
    </div>
    <div class="main-container">
      <app-main />
    </div>
  </div>
</template>

<script>
import { SideBar, AppMain } from './components'

export default {
  name: 'Layout',
  components: {
    SideBar,
    AppMain
  },
  computed: {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
// @import "~@/styles/mixin.scss";
// @import "~@/styles/variable.scss";

.app-wrapper {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .header {
    height: 100%;
    width: 150px;
    position: relative;
  }
  .main-container {
    width: calc(100vw - 150px);
    display: flex;
    overflow: hidden;
    position: relative;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  height: 100%;
  width: 150px;
  transition: width 0.28s;
}
</style>
