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
      <button class="btn btn-sm btn-dark" @click="addIncorrectAnswer(index)">Add Incorrect Answer</button>
      <div v-for="(incorrectAnswer, index) in question.choices" :key="index">
      <div class="input-group pt-2 pb-2">
      <div class="input-group-prepend">
        <span class="input-group-text">Wrong Answer</span>
      </div>
      <input v-model="incorrectAnswer.value" type="text" name="wronganswer" class="form-control input">
      </div>
    </div>
  </div>
  <div id="student" v-else>
    <div v-if="submitted">
      <span class="font-weight-bold">{{index + 1}}. {{ question.question }}</span>
        <div class="custom-control custom-radio">
          <input type="radio" class="custom-control-input submitted-input" :value="question.answer" :id="question.answer" :name="'option'+question._id" v-model="question.value" disabled>
          <label class="custom-control-label" :for="question.answer">{{ question.answer }}</label>
        </div>
        <div v-for="(incorrectAnswer, index) in question.choices" :key="index">
          <div class="custom-control custom-radio">
          <input type="radio" class="custom-control-input submitted-input" :value="incorrectAnswer.value" :id="incorrectAnswer.value" :name="'option'+question._id" v-model="question.value" disabled>
          <label class="custom-control-label" :for="incorrectAnswer.value"> {{ incorrectAnswer.value }}</label>
          </div>
        </div>
    </div>
    <div v-else>
      <span class="font-weight-bold">{{index + 1}}. {{ question.question }}</span>
        <div class="custom-control custom-radio">
          <input type="radio" class="custom-control-input" :value="question.answer" :id="question._id" :name="'option'+question._id" v-model="question.value">
          <label class="custom-control-label" :for="question._id">{{ question.answer }}</label>
        </div>
        <div v-for="(incorrectAnswer, index) in question.choices" :key="index">
          <div class="custom-control custom-radio">
          <input type="radio" class="custom-control-input" :value="incorrectAnswer.value" :id="incorrectAnswer.value+question._id" :name="'option'+question._id" v-model="question.value">
          <label class="custom-control-label" :for="incorrectAnswer.value+question._id"> {{ incorrectAnswer.value }}</label>
          </div>
        </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import $ from 'jquery'

export default {
  name: 'multipleChoice',
  data () {
    return {
      isAnswerRight: null
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
      save: 'courses/updateAssessmentContent',
      removeQuestion: 'courses/deleteAssessmentContent'
    }),
    addIncorrectAnswer (index) {
      this.module.content[index].choices.push({ value: '' })
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
.input {
  max-width: 25%;
}
</style>
