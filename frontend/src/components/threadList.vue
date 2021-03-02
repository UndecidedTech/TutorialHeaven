<template>
<div>
    <div class="card d-flex threadCard mb-3 mt-3">
        <div class="row row-0 justify-content-center">
        <div class="col-md-3">
            <img
                :src="thread.image"
                class="w-100 h-100 p-2 threadImage"
                alt="Card side image"
            />
        </div>
        <div class="col">
            <div class="card-body pl-0">
            <h3 class="card-title threadTitle" @click="goToThread(thread._id)">{{ thread.title }}</h3>
            <div class="text-muted" v-html="thread.text"></div>
            <div class="d-flex align-items-center pt-4 mt-auto">
                <div class="ms-3">
                <div class="text-body">{{ thread.created_by.name }}</div>
                <div class="text-muted">{{ thread.created_on }}</div>
                </div>
                <div class="ml-auto fa-2x">
                <span class="fa-layers fa-fw" data-toggle="tooltip" data-placement="top" title="Post" @click="goToThread(thread._id)">
                    <i class="far fa-comments"></i>
                    <span class="fa-layers-counter" style="font-size: 3rem; background-color:#007bff">{{ thread.posts.length }}</span>
                </span>
                <span class="fa-layers fa-fw"  data-toggle="tooltip" data-placement="top" title="Like" @click="likeThread({courseID:$route.params.courseID, threadID: thread._id})">
                    <i class="far fa-heart"></i>
                    <span class="fa-layers-counter" style="font-size: 3rem;">{{ thread.likes.length }}</span>
                </span>
                <span class="fa-layers fa-fw red"  data-toggle="tooltip" data-placement="top" title="Delete" v-if="course.instructors.includes(user._id) || thread.created_by.userI" @click="removeThread({courseID: $route.params.courseID, threadID: thread._id})">
                      <i class="fas fa-times"></i>
                  </span>
                </div>
            </div>
              <a v-show="thread.relation" class="float-right relationLink" @click="$router.push({ name: 'course', params: {courseID: $route.params.courseID, sectionID: thread.relation.sectionId, moduleID: thread.relation.moduleId } })">Related Material</a>
            </div>
        </div>
        </div>
    </div>
</div>
</template>
<script>
import $ from 'jquery'
import { mapActions, mapGetters } from 'vuex'
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
    ...mapActions({
      likeThread: 'forum/likeThread',
      removeThread: 'forum/removeThread'
    }),
    goToThread (threadID) {
      this.$router.push({ name: 'forum', params: { courseID: this.$route.params.courseID, threadID: threadID } })
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      course: 'courses/course'
    })
  },
  mounted () {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    })
    $('[data-toggle="tooltip"]').on('click', function () {
      $(this).tooltip('hide')
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.threadTitle:hover{
  color: #007bff;
  cursor: pointer;
}
.fa-comments:hover {
  color: #007bff;
}
.fa-heart:hover {
  color: #ff253a;
}
.fa-layers:hover {
  cursor: pointer;
}
.threadImage {
  border-radius: 15px;
}
.relationLink:hover {
  cursor: pointer;
}
</style>
