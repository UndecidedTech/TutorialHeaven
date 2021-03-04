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
  max-height: 100%;
}

.pointer {
  cursor: pointer;
}
</style>
