<template>
<div id='app'>
<navBar></navBar>
<router-view></router-view>
</div>
</template>

<script>
import navBar from './components/navBar'
export default {
  name: 'app',
  components: {
    navBar
  }
}
</script>

<style>
.appBackground {
  background-color:#FFFFFF;
  font-family: 'Roboto', sans-serif;
}
html,body {
  font-family: 'Roboto', sans-serif;
}
/* .container {
  background-color:#FFFFFF;
  font-family: sans-serif;
  max-width: 80%;
  margin: 0 auto;
} */

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #000000;
}
</style>
