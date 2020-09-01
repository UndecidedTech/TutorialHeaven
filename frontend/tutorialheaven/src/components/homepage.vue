<template>
<div class="appBackground pt-1">
<div id="content" class="container">
</div>
<h1 id="name" @click="logName()">FUUDJFkj</h1>
</div>
</template>
<script>
import axios from "axios";
export default {
  name: "homepage",
  components: {},
  methods: {
    async logName() {
      var a = document.getElementById("name");
      a.innerText = await axios.get("http://localhost:5000/api/users/session");
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
