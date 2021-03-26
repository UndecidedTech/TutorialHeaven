<template>
<div>
  <div class="card mx-auto bg-color" style="width: 18rem;">
  <div class="card-body">
    <div class="text-center"><i class="fas fa-user-graduate fa-2x"></i></div>
    <h5 class="card-title text-center">{{ title }}</h5>
    <h1 class="card-text text-center font-weight-bold"> {{ number }} </h1>
  </div>
</div>
</div>
</template>
<script>
export default {
  name: 'statsCounter',
  components: {
  },
  props: {
    number: Number,
    title: String
  },
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.th-center {
  text-align: center
}
.bg-color {
  background-color: cadetblue;
}
</style>
