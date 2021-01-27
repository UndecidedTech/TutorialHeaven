<template>
  <div class="appBackground container">
    <button class="btn btn-primary" data-toggle="modal" data-target="#joinConfirmModal">Create Thread</button>
    <div v-if="this.$route.params.courseID && !this.$route.params.threadID">
      <div v-for="(thread, index) in threads" :key="index" class="">
        <threadList :thread="thread"/>
      </div>
      </div>
    <div v-else-if="this.$route.params.threadID && this.$route.params.threadID">
      Thread View goes here
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
        <button type="button" data-dismiss="modal" class="btn btn-success">Post</button>
      </div>
    </div>
  </div>
  </div>
</div>
</template>
<script>
import { VueEditor } from 'vue2-editor'
import { mapGetters } from 'vuex'
import threadList from '../components/threadList'
export default {
  name: 'forum',
  components: {
    threadList,
    VueEditor
  },
  data () {
    return {
      newThread: {
        title: '',
        text: ''
      },
      threads: [
        {
          title: 'Bran is Posting',
          text: 'Travis is working hard on the apidoc and Alex is just sitting over my shoulder and ????Watching???',
          date: Date(),
          image: 'https://tutorialheaven.s3.us-east-2.amazonaws.com/1611092748435',
          creator: 'Brendan Powers'
        }
      ]
    }
  },
  methods: {
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    }),
    courseID: function () {
      return this.$route.params.courseID
    }
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
