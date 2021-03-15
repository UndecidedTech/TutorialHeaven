<template>
<div>
  <input type="text" name="subject" id="subjectInput" v-model="subjectInput">
  <button class="btn btn-success" @click="postSubject({courseID: course._id, subject: subjectInput})">Submit</button>
  <div v-for="(subject, index) in course.subjects" :key="index">{{subject}}</div>
</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'courseSettings',
  components: {
  },
  data () {
    return {
      subjectInput: ''
    }
  },
  methods: {
    ...mapActions({
      postSubject: 'courses/postSubject'
    }),
    cl (event) {
      console.log(event)
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      course: 'courses/course'
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
</style>
