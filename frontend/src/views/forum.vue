<template>
  <div class="appBackground">
    <div v-if="this.$route.params.courseID && !this.$route.params.threadID">
       <button class="d-inline btn btn-primary float-right mr-3" data-toggle="modal" data-target="#createThreadModal">Create Thread</button>
      <div v-for="(thread, index) in threads" :key="index" class="container">
        <threadList :thread="thread"/>
      </div>
      </div>
    <div v-else-if="this.$route.params.courseID && this.$route.params.threadID" class="container">
      <!-- this.$route.params.courseID && this.$route.params.threadID -->
      <thread/>
  </div>
  <div class="modal fade" tabindex="-1" id="createThreadModal">
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
            <label for="select" class="col-form-label">Relation:</label>
            <select id="select" class="form-control input" v-model="newThread.relation">
            <option value="" selected>...</option>
            <optgroup v-for="(item, index) in course.sections" :value="item._id" :key="index" :label="item.name">
              <option v-for="(item2, index) in item.modules" :value="{sectionID: item._id, moduleID: item2._id}" :key="index">{{item2.type}}: {{item2.name}}</option>
            </optgroup>
            </select>
            {{newThread.relation}}
          </div>
          <div class="form-group">
            <label for="text" class="col-form-label">Text:</label>
            <vue-editor id="postEditor" v-model="newThread.text"></vue-editor>
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
        relation: {},
        courseID: this.$route.params.courseID
      }
    }
  },
  methods: {
    ...mapActions({
      getThreads: 'forum/getThreads',
      createThread: 'forum/createThread',
      getCourse: 'courses/getCourse'
    }),
    selectedFile (event) {
      this.newThread.image = event.target.files[0]
    },
    relationObj (data) {
      return { sectionID: data.sectionID, moduleID: data.moduleID }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      threads: 'forum/threads',
      course: 'courses/course'
    }),
    courseID: function () {
      return this.$route.params.courseID
    }
  },
  mounted () {
    this.getThreads(this.courseID)
    this.getCourse(this.$route.params.courseID)
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
