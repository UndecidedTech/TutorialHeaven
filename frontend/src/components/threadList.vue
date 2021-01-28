<template>
<div>
    <div class="card d-flex threadCard">
        <div class="row row-0 justify-content-center">
        <div class="col-md-3">
            <a href="#">
            <img
                :src="thread.image"
                class="w-100 h-100 object-cover"
                alt="Card side image"
            />
            </a>
        </div>
        <div class="col">
            <div class="card-body">
            <h3 class="card-title threadTitle" @click="goToThread(thread._id)">{{ thread.title }}</h3>
            <div class="text-muted" v-html="thread.text"></div>
            <div class="d-flex align-items-center pt-4 mt-auto">
                <span
                class="avatar"
                style="background-image: url(...)"
                ></span>
                <div class="ms-3">
                <div class="text-body">{{ thread.created_by }}</div>
                <div class="text-muted">{{ thread.created_on }}</div>
                </div>
                <div class="ml-auto fa-2x">
                <span class="fa-layers fa-fw">
                    <i class="far fa-comments"></i>
                    <!-- {{ thread.likes }} -->
                    <span class="fa-layers-counter" style="font-size: 3rem;">{{ thread.likes }}</span>
                </span>
                <span class="fa-layers fa-fw">
                    <i class="far fa-heart"></i>
                    <!-- {{ thread.posts.length }} -->
                    <span class="fa-layers-counter" style="font-size: 3rem;">{{ thread.posts.length }}</span>
                </span>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
  name: 'threadList',
  props: {
    thread: Object
  },
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    goToThread (threadID) {
      this.$router.push({ name: 'forum', params: { courseID: this.$route.params.courseID, threadID: threadID } })
    }
  },
  computed: {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.threadTitle:hover{
  color: #007bff;
  cursor: pointer;
}
</style>
