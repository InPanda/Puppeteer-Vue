<template>
  <div id="app">
    <RequestServer />
  </div>
</template>

<script>
import RequestServer from './components/RequestServer'

export default {
  name: 'App',
  components: {
    RequestServer
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
