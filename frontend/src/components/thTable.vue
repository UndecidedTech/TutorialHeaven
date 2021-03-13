<template>
<div class="m-3 table-responsive">
  <div class="text-center font-weight-bold p-2">{{tableName}}</div>
  <table class="table">
    <thead class="thead-light">
      <tr>
        <th scope="col" v-for="(header, index) in tableData[0]" :key="index">{{header}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(rows, x) in tableData.length - 1" :key="x">
        <td v-for="(item, y) in tableData[x + 1]" :key="y">{{item}}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>

export default {
  name: 'thTable',
  components: {
  },
  props: {
    tableData: Array,
    tableName: String
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
</style>
