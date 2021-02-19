<template>
  <div class="appBackground">
    <div v-if="this.$route.params.courseID && !this.$route.params.threadID">
      <div class="d-flex flex-row justify-content-between">
        <input type="text" class="form-control search-bar" placeholder="Search" aria-label="Search" id="querySearch" @keyup="setSearch($event.target.value)">
        <button class="btn btn-primary m-2" data-toggle="modal" data-target="#createThreadModal">Create Thread</button>
      </div>
      <div v-for="(thread, index) in filterThreadList" :key="index" class="container">
        <threadList :thread="thread"/>
      </div>
      <pagination class="d-flex flex-column align-items-center" @pagechanged="setCurrentPage($event)" :totalPages="Math.ceil(filterThreadList.length / 5)" :currentPage="currentPage"/>
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
            <optgroup v-for="(section, index) in course.sections" :value="section._id" :key="index" :label="section.name">
              <option v-for="(module, index) in section.modules" :value="{sectionID: module._id, moduleID: module._id}" :key="index">{{module.type.toUpperCase()}}: {{module.name}}</option>
            </optgroup>
            </select>
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
import pagination from '../components/pagination'

export default {
  name: 'forum',
  components: {
    threadList,
    VueEditor,
    thread,
    pagination
  },
  data () {
    return {
      newThread: {
        title: '',
        text: '',
        image: '',
        relation: {},
        courseID: this.$route.params.courseID
      },
      currentPage: 1,
      search: false
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
    },
    findPosts () {
      const posts = this.filterThreads
      if (this.currentPage === 1) {
        const sliceFloor = this.currentPage - 1
        console.log('floor', sliceFloor)
        return posts.slice(sliceFloor, this.currentPage * 5)
      } else {
        const sliceFloor = (this.currentPage - 1) * 5
        console.log(sliceFloor, (this.currentPage * 5) - 1)
        return posts.slice(sliceFloor, (this.currentPage * 5))
      }
    },
    setCurrentPage (e) {
      console.log('currentPage = ', e)
      this.currentPage = e
    },
    setSearch (e) {
      this.search = e
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      threadsList: 'forum/threads',
      course: 'courses/course'
    }),
    filterThreadList () {
      if (this.search) {
        return this.threadsList.threads.filter(e => e.title.toLowerCase().includes(this.search))
      } else {
        return this.threadsList.threads
      }
    }
  },
  created () {
    this.getThreads(this.$route.params.courseID)
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
.search-bar {
  width: 25%;
  margin: 10px;
}
</style>
