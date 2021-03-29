<template>
<div>
  <div id="instructor" v-if="course.instructors.includes(user._id)">
      <button class="btn btn-danger mb-2" @click="removeQuestion({sectionID: section._id, moduleID: module._id, contentID: question._id})"> Remove Question</button>
      <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon">Question</span>
      </div>
      <input v-model="question.question" type="text" name="question" class="form-control input" aria-describedby="basic-addon">
      </div>
      <div class="input-group pt-2 pb-2">
      <div class="input-group-prepend">
        <span class="input-group-text">Answer</span>
      </div>
      <input v-model="question.answer" type="text" name="answer" class="form-control input">
    </div>
  </div>
  <div id="student" v-else>
    <div v-if="submitted">
      <span class="font-weight-bold">{{index + 1}}. {{ question.question }}</span>
       <div>
         <input v-model="userResponse.responses[this.index].value" type="text" disabled/>
       </div>
    </div>
    <div v-else>
      <span class="font-weight-bold">{{index + 1}}. {{ question.question }}</span>
        <div>
          <input v-model="question.value" type="text">
        </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import $ from 'jquery'

export default {
  name: 'openQuestion',
  data () {
    return {

    }
  },
  props: {
    question: Object,
    index: Number,
    section: Object,
    module: Object,
    answers: Array,
    submitted: Boolean
  },
  methods: {
    ...mapActions({
      addQuestion: 'courses/createAssessmentContent',
      removeQuestion: 'courses/deleteAssessmentContent'
    })

  },
  computed: {
    ...mapGetters({
      course: 'courses/course',
      user: 'user/user',
      userCourses: 'user/userCourses'
    }),
    userResponse () {
      const course = this.userCourses.find(course => {
        if (course._id === this.$route.params.courseID) {
          return course
        }
      })
      const result = course.results.find(result => {
        if (result._id === this.$route.params.moduleID) {
          return result
        }
      })
      return result
    }
  },
  mounted () {
    if (this.submitted) {
      $('.submitted-input').each((index, element) => {
        const jElement = $(element)
        const eleValue = element.value
        this.userResponse.responses.forEach(response => {
          if (response.value === eleValue) {
            jElement.prop('checked', true)
          }
        })
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.select {
  width: 7%
}
.input {
  max-width: 25%;
}
</style>
