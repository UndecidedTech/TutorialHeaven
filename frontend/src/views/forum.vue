<template>
<div class="appBackground">
  {{ courseID }}
  <div>
    <div class="card d-flex flex-column">
    <div class="row row-0 flex-fill">
      <div class="col-md-3">
        <a href="#">
          <img src="" class="w-100 h-100 object-cover" alt="Card side image">
        </a>
      </div>
      <div class="col">
        <div class="card-body">
          <h3 class="card-title"><a href="#">Shut up!</a></h3>
          <div class="text-muted">Burn her! How do you know she is a witch? You don't frighten us, English pig-dogs! Go and boil yo...</div>
          <div class="d-flex align-items-center pt-4 mt-auto">
            <span class="avatar" style="background-image: url(...)"></span>
            <div class="ms-3">
              <a href="#" class="text-body">Egan Poetz</a>
              <div class="text-muted">3 days ago</div>
            </div>
            <div class="ms-auto">
              <a href="#" class="icon d-none d-md-inline-block ms-3 text-red">
                <!-- SVG icon code -->
              </a>
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
export default {
  name: 'forum',
  components: {
  },
  data () {
    return {
      thread: {
        name: String,
        creator: Number,
        date: Date,
        text: String,
        posts: Array
      },
      post: {
        creator: String,
        date: Date,
        text: String
      }
    }
  },
  methods: {
  },
  computed: {
    courseID: function () {
      return this.$route.params.courseID
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
</style>
