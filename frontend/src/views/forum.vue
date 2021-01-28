<template>
  <div class="appBackground container">
    <div v-if="this.$route.params.courseID && !this.$route.params.threadID">
    <button class="btn btn-primary" data-toggle="modal" data-target="#joinConfirmModal">Create Thread</button>
      <div v-for="(thread, index) in threads" :key="index" class="">
        <threadList :thread="thread"/>
      </div>
      </div>
    <div v-else-if="this.$route.params.courseID && this.$route.params.threadID">
      <!-- this.$route.params.courseID && this.$route.params.threadID -->
      <thread/>
  </div>
  <div class="modal fade" tabindex="-1" id="joinConfirmModal">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Create Thread</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="title" class="col-form-label">Title:</label>
            <input type="text" class="form-control" id="title" required v-model="newThread.title">
          </div>
          <div class="form-group">
            <label for="text" class="col-form-label">Text:</label>
            <vue-editor v-model="newThread.text"></vue-editor>
          </div>
          <div class="custom-file">
            <input name="fileUpload" type="file" class="custom-file-input" id="customFile" @change="selectedFile($event)">
            <label class="custom-file-label" for="customFile">Choose file</label>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" data-dismiss="modal" class="btn btn-success" @click="createThread(newThread)">Create Thread</button>
      </div>
    </div>
  </div>
  </div>
</div>
</template>
<script>
import { VueEditor } from 'vue2-editor'
import { mapGetters, mapActions } from 'vuex'
import threadList from '../components/threadList'
import thread from '../components/thread'

export default {
  name: 'forum',
  components: {
    threadList,
    VueEditor,
    thread
  },
  data () {
    return {
      newThread: {
        title: '',
        text: '',
        image: '',
        courseID: this.$route.params.courseID
      }
    }
  },
  methods: {
    ...mapActions({
      getThreads: 'forum/getThreads',
      createThread: 'forum/createThread'
    }),
    selectedFile (event) {
      this.newThread.image = event.target.files[0]
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      threads: 'forum/threads'
    }),
    courseID: function () {
      return this.$route.params.courseID
    }
  },
  mounted () {
    this.getThreads(this.courseID)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
/*
.threadCard {
}
*/
.heartIcon {
  float: right;
}
</style>
