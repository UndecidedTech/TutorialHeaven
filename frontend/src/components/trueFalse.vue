<template>
<div>
  <div id="instructor" v-if="course.instructors.includes(user._id)">
    <button class="btn btn-danger" @click="removeQuestion({sectionID: section._id, moduleID: module._id, contentID: question._id})"> Remove Question</button>
    <div class="input-group pt-2 pb-2">
      <div class="input-group-prepend">
        <span class="input-group-text">Question</span>
      </div>
      <input class="w-25" type="text" v-model="question.question">
    </div>
    <div class="input-group pt-2 pb-2">
      <div class="input-group-prepend"><span class="input-group-text">Answer</span></div>
      <select class="form-control input" v-model="question.answer">
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
  </div>
  <div id="student" v-else>
    <div v-if="submitted">
      <span class="font-weight-bold">{{index + 1}}. {{ question.question }}</span>
      <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input submitted-input true-false" :id="'true'+question._id" :name="question._id" :checked="checkSubmitted('true')" disabled>
        <label class="custom-control-label" for="true">True</label>
      </div>
      <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input submitted-input true-false" :id="'false'+question._id" :checked="checkSubmitted('false')" :name="question._id" disabled>
        <label class="custom-control-label" for="false">False</label>
      </div>
    </div>
    <div v-else>
      <span class="font-weight-bold">{{index + 1}}. {{ question.question }}</span>
      <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input" :id="'true'+question._id" :name="question._id" value="true" v-model="question.value">
        <label class="custom-control-label" :for="'true'+question._id">True</label>
      </div>
      <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input" :id="'false'+question._id" :name="question._id" value="false" v-model="question.value">
        <label class="custom-control-label" :for="'false'+question._id">False</label>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'trueFalse',
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
    }),
    checkSubmitted (bool) {
      if (this.userResponse.responses[this.index].value === bool) {
        return true
      } else {
        return false
      }
    }
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
