<template>
  <div
    id="index"
    ref="appRef"
  >
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div
        v-else
        class="host-body"
        :class="[
      'window',
      hideCursor ? 'cursor__none' : '',
      { fullWindow: isFullScreen },
    ]"
        ref="window"
        @dblclick="toggleFullScreen"
        id="full-screen"
      >
        <div class="d-flex jc-center">
          <dv-decoration-10 class="dv-dec-10" />
          <div class="d-flex jc-center">
            <dv-decoration-8
              class="dv-dec-8"
              :color="['#568aea', '#000000']"
            />
            <div class="title">
              <span class="title-text">大数据可视化平台</span>
              <dv-decoration-6
                class="dv-dec-6"
                :reverse="true"
                :color="['#50e3c2', '#67a1e5']"
              />
            </div>
            <dv-decoration-8
              class="dv-dec-8"
              :reverse="true"
              :color="['#568aea', '#000000']"
            />
          </div>
          <dv-decoration-10 class="dv-dec-10-s" />
        </div>

        <!-- 第二行 -->
        <div class="d-flex jc-between px-2">
          <div class="d-flex aside-width">
            <div class="react-left ml-4 react-l-s">
              <span class="react-before"></span>
              <span class="text">数据分析1</span>
            </div>
            <div class="react-right ml-3">
              <span class="text">数据分析2</span>
            </div>
          </div>
          <div class="d-flex aside-width">
            <div class="react-right bg-color-blue mr-3">
              <span class="text fw-b">大屏demo</span>
            </div>
            <div class="react-right mr-4 react-l-s">
              <span class="react-after"></span>
              <span class="text">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</span>
            </div>
          </div>
        </div>

        <div class="body-box">
          <!-- 第三行数据 -->
          <div class="content-box">
            <div>
              <dv-border-box-12>
                <centerLeft1 />
              </dv-border-box-12>
            </div>
            <div>
              <dv-border-box-12>
                <centerLeft2 />
              </dv-border-box-12>
            </div>
            <!-- 中间 -->
            <div>
              <center />
            </div>
            <!-- 中间 -->
            <div>
              <centerRight2 />
            </div>
            <div>
              <dv-border-box-13>
                <centerRight1 />
              </dv-border-box-13>
            </div>
          </div>

          <!-- 第四行数据 -->
          <div class="bototm-box">
            <dv-border-box-13>
              <bottomLeft />
            </dv-border-box-13>
            <dv-border-box-12>
              <bottomRight />
            </dv-border-box-12>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import drawMixin from "@/utils/drawMixin";
import { waitLoaded } from "@/utils/utils";
import { formatTime } from '@/utils/index.js'
import centerLeft1 from './centerLeft1'
import centerLeft2 from './centerLeft2'
import centerRight1 from './centerRight1'
import centerRight2 from './centerRight2'
import center from './center'
import bottomLeft from './bottomLeft'
import bottomRight from './bottomRight'

export default {
  mixins: [drawMixin],
  data() {
    return {
      isFullScreen: false,
      hideCursor: false,
      timing: null,
      loading: true,
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    }
  },
  components: {
    centerLeft1,
    centerLeft2,
    centerRight1,
    centerRight2,
    center,
    bottomLeft,
    bottomRight
  },

  methods: {
    timeFn() {
      this.timing = setInterval(() => {
        this.dateDay = formatTime(new Date(), 'HH: mm: ss')
        this.dateYear = formatTime(new Date(), 'yyyy-MM-dd')
        this.dateWeek = this.weekday[new Date().getDay()]
      }, 1000)
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    clickBoard() {
      if (!this.showDropdown) return;
      else {
        this.showDropdown = false;
      }
    },
    toggleFullScreen() {
      const element = this.$refs.window;
      if (!this.isFullScreen) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        }
        // document.querySelector("body").style.cursor = "none";
        this.isFullScreen = true;
      }
    },
    windowResize() {
      const bodyWidth = getComputedStyle(
        document.querySelector("body")
      ).getPropertyValue("width");
      const windowWidth = getComputedStyle(
        document.querySelector("#full-screen")
      ).getPropertyValue("width");
      if (bodyWidth !== windowWidth) {
        this.isFullScreen = false;
      }
    },
    // 监听鼠标移动事件
    listenMouseMove() {
      this.hideCursor = false;
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = setTimeout(() => {
        this.hideCursor = true;
      }, 3000);
    }
  },
  watch: {
    isFullScreen(val) {
      const screen = this.$refs.window;
      if (val) {
        // 全屏模式下监听鼠标移动
        this.hideCursor = true;
        screen.addEventListener("mousemove", this.listenMouseMove);
      } else {
        // 非全屏模式下取消监听，恢复鼠标光标
        this.hideCursor = false;
        screen.removeEventListener("mousemove", this.listenMouseMove);
      }
    },
  },
  mounted() {
    this.timeFn()
    this.cancelLoading()
    waitLoaded(200, "#full-screen", 2000, () => {
      const w = document.querySelector("#full-screen").clientWidth;
      document.querySelector("#full-screen").style.height = `${w * (1080 / 1920)
        }px`;
      window.addEventListener("resize", this.windowResize);
    });
  },
  beforeDestroy() {
    clearInterval(this.timing);
    window.removeEventListener("resize", this.windowResize);
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/index.scss';
.window {
  &.fullWindow {
    width: 100vw;
    height: 100vh;
  }
  &.cursor__none {
    cursor: none;
  }
}
</style>
