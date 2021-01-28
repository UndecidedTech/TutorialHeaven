<template>
<div class="container p-0">
  <div v-for="(post, index) in posts" :key="index">
    <div class="card d-flex">
          <div class="row row-0 justify-content-center flex-grow-1">
          <div class="col">
              <div class="card-body">
              <h3 class="card-title ">{{ post.title }}</h3>
              <div class="text-muted">{{ post.text }}</div>
              <div class="d-flex align-items-center pt-4 mt-auto">
                  <span
                  class="avatar"
                  style="background-image: url(...)"
                  ></span>
                  <div class="ms-3">
                  <a href="#" class="text-body">{{ post.creator }}</a>
                  <div class="text-muted">{{ post.date }}</div>
                  </div>
                  <div class="ml-auto fa-2x">
                  <span class="">
                      <i class="fas fa-reply"></i>
                  </span>
                  </div>
              </div>
              </div>
          </div>
        </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'thread',
  components: {
  },
  data () {
    return {
      threadID: this.$route.params.threadID,
      posts: [{
        title: 'test',
        text: 'sadjfkasjdklfjaklsjdfklj ajfdkljsakldfjklsadfklj'
      }]
    }
  },
  methods: {
    ...mapActions({})
  },
  computed: {
    ...mapGetters({
      threads: 'forum/threads',
      thread: 'forum/thread'
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
</style>
