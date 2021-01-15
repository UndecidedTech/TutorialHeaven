<template>
<div class="appBackground">
   <table  style="width:100%">
  <tr>
    <th>Course Name</th>
    <th>Course Subject</th>
    <th>Number of Students</th>
    <th>Number of Sections</th>
    <th>Course ID</th>
  </tr>
  <tr v-for="course in this.courseList" :key="course._id">
    <td>{{ course.name }}</td>
    <td>{{ course.subject }}</td>
    <td>{{ course.students.length }}</td>
    <td>{{ course.sections.length }}</td>
    <td>{{ course._id }}</td>
  </tr>
</table>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'courseCatalog',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions({
      getCourseList: 'courses/getCourseList'
    })
  },
  computed: {
    ...mapGetters({
      courseList: 'courses/courseList'
    })
  },
  watch: {
    getCourse: {
      immediate: true,
      handler () {
        this.getCourseList()
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
</style>
