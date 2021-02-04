<template>
<div class="p-0 d-flex flex-column align-items-center">
  <div class="card d-flex threadCard mb-3 mt-3">
        <div class="row row-0 justify-content-center">
        <div class="col-md-3">
            <img
                :src="findMainPost().image"
                class="w-100 h-100 p-2 threadImage"
                alt="Card side image"
            />
        </div>
        <div class="col">
            <div class="card-body pl-0">
            <h3 class="card-title threadTitle">{{ findMainPost().title }}</h3>
            <div class="text-body" v-html="findMainPost().text"></div>
            <div class="d-flex align-items-center pt-4 mt-auto">
                <div class="ms-3">
                <div class="text-body">{{ findMainPost().created_by.name }}</div>
                <div class="text-muted">{{ findMainPost().created_on }}</div>
                </div>
                <div class="ml-auto fa-2x">
                  <span data-toggle="tooltip" data-placement="top" title="Reply">
                      <i class="fas fa-reply" data-toggle="collapse" data-target="#mainThreadReply" aria-expanded="false" aria-controls="collapseExample"></i>
                  </span>
                  <span class="fa-layers fa-fw"  data-toggle="tooltip" data-placement="top" title="Like" @click="likeThread({courseID:$route.params.courseID, threadID: thread._id})">
                      <i class="far fa-heart"></i>
                      <span class="fa-layers-counter" style="font-size: 3rem;">{{ findMainPost().likes.length }}</span>
                  </span>
                </div>
            </div>
            <a class="float-right relationLink" @click="$router.push({ name: 'course', params: {courseID: $route.params.courseID, sectionID: findMainPost().relation.sectionId, moduleID: findMainPost().relation.moduleId } })">Related Material</a>
            </div>
        </div>
        </div>
        <div class="collapse p-3" id="mainThreadReply">
          <VueEditor v-model="editorContent" :id="'postEditor'+findMainPost()._id"></VueEditor>
          <button class="btn btn-sm btn-danger float-right m-2" @click="createPost({text: editorContent, courseID: $route.params.courseID, threadID: $route.params.threadID})">Post Reply</button>
        </div>
  </div>
  <div v-for="(post, index) in findMainPost().posts" :key="index" style="width: 85%;">
    <div class="card d-flex">
          <div class="row row-0 justify-content-center flex-grow-1">
          <div class="col">
              <div class="card-body">
              <h4 class="card-title">{{ post.created_by.name }}</h4>
              <div class="text-body">{{ post.text }}</div>
              <div class="d-flex align-items-center pt-4 mt-auto">
                  <div class="ms-3">
                  <div class="text-muted">{{ post.date }}</div>
                  </div>
                  <div class="ml-auto fa-2x">
                  <span data-toggle="tooltip" data-placement="top" title="Reply">
                      <i class="fas fa-reply" data-toggle="collapse" :data-target="'#'+post._id" aria-expanded="false" aria-controls="collapseExample"></i>
                  </span>
                  </div>
              </div>
              <!-- <div class="collapse" :id="post._id">
              <VueEditor v-model="editorContent" :id="'postEditor'+post._id"></VueEditor>
              <button class="btn btn-sm btn-danger float-right m-2" @click="createPost({text: editorContent, courseID: $route.params.courseID, threadID: $route.params.threadID, postID: post._id})">Post Reply</button>
              </div> -->
              </div>
          </div>
        </div>
    </div>
  </div>
</div>
</template>
<script>
import { VueEditor } from 'vue2-editor'
import $ from 'jquery'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'thread',
  components: {
    VueEditor
  },
  data () {
    return {
      threadID: this.$route.params.threadID,
      editorContent: ''
    }
  },
  methods: {
    ...mapActions({
      createPost: 'forum/createPost'
    }),
    findMainPost () {
      return this.threads.find(ele => ele._id === this.threadID)
    }
  },

  computed: {
    ...mapGetters({
      threads: 'forum/threads'
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
.fa-heart:hover {
  color: #ff253a;
}
.fa-comments:hover {
  color: #007bff;
}
.fa-layers:hover {
  cursor: pointer;
}
.fa-reply:hover {
  color:#007bff;
  cursor: pointer;
}
.threadImage {
  border-radius: 15px;
}
.relationLink:hover {
  cursor: pointer
}
</style>
