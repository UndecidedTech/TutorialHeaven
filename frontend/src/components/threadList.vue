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
            <h3 class="card-title">{{ thread.title }}</h3>
            <div class="text-muted">{{ thread.text }}</div>
            <div class="d-flex align-items-center pt-4 mt-auto">
                <span
                class="avatar"
                style="background-image: url(...)"
                ></span>
                <div class="ms-3">
                <a href="#" class="text-body">{{ thread.creator }}</a>
                <div class="text-muted">{{ thread.date }}</div>
                </div>
                <div class="ml-auto fa-2x">
                <span class="fa-layers fa-fw">
                    <i class="far fa-comments"></i>
                    <span class="fa-layers-counter" style="font-size: 3rem;">20</span>
                </span>
                <span class="fa-layers fa-fw">
                    <i class="far fa-heart"></i>
                    <span class="fa-layers-counter" style="font-size: 3rem;">3</span>
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
  },
  computed: {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
</style>
