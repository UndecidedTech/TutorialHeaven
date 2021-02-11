<template>
<div>
  <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item" :class="{ disabled: currentPage === 1}"><button @click="onClickPreviousPage" class="page-link">Previous</button></li>
    <li v-for="page in pages" :key="page.name" class="page-item" :class="{ active: page.isDisabled }"><button @click="onClickPage(page.name)" type="button" class="page-link">{{ page.name }}</button></li>
    <li class="page-item" :class="{ disabled: currentPage === totalPages}"><button @click="onClickNextPage" class="page-link">Next</button></li>
  </ul>
</nav>
</div>
</template>
<script>
export default {
  name: 'pagination',
  components: {
  },
  props: {
    totalPages: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    onClickPage (page) {
      this.$emit('pagechanged', page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    onClickNextPage () {
      if (this.currentPage < this.totalPages) {
        this.$emit('pagechanged', this.currentPage + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    onClickPreviousPage () {
      if (this.currentPage - 1 > 0) {
        this.$emit('pagechanged', this.currentPage - 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  },
  computed: {
    pages: function () {
      const range = []
      for (let i = 1; i <= this.totalPages; i += 1) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage
        })
      }
      return range
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
</style>
