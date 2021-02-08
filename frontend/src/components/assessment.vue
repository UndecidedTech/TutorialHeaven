<template>
<div>
  <button class="btn btn-primary mb-3" @click="goBack">Return</button>
  <div class="float-right mb-3">
  <button class="btn btn-success" v-if="course.instructors.includes(user._id)" @click="save({sectionID: section._id, moduleID: module._id, value: module.content})">Save</button>
  </div>
  <div id="student" v-if="!course.instructors.includes(user._id)">
    <div v-for="(question, index) in module.content" :key="index">
      <div v-if="isSubmitted" class="card w-75 m-3" :class="checkAnswer(index, question) ? 'border-success' : 'border-danger'">
      <div class="card-body">
          <multipleChoice v-if="question.type === 'multiple-choice'" v-bind:question="question" v-bind:index="index" v-bind:submitted="true"/>
          <trueFalse v-else-if="question.type === 'trueFalse'" v-bind:question="question" v-bind:index="index" v-bind:submitted="true"/>
          <openQuestion v-else-if="question.type === 'openQuestion'" v-bind:question="question" v-bind:index="index" v-bind:submitted="true"/>
          <button v-if="question.relation" class="btn btn-warning"  @click="goToRelation(question.relation)">Related Material</button>
        </div>
      </div>
      <div v-else class="card w-75 m-3">
      <div class="card-body">
        <multipleChoice v-if="question.type === 'multiple-choice'" v-bind:question="question" v-bind:index="index"/>
        <trueFalse v-else-if="question.type === 'trueFalse'" v-bind:question="question" v-bind:index="index"/>
        <openQuestion v-else-if="question.type === 'openQuestion'" v-bind:question="question" v-bind:index="index"/>
      </div>
    </div>
    </div>
    <button v-if="!isSubmitted" class="btn btn-danger float-right mt-3 mr-3" @click="submit({responses: test, courseID: $route.params.courseID, sectionID: $route.params.sectionID, moduleID: $route.params.moduleID}); goBack();">Submit</button>
  </div>
  <div id="instructor" v-else>
    <div class="dropdown show pt-2 pr-2 pl-4 float-right">
    <a class="btn btn-primary dropdown-toggle" role="button" id="addContent" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Add Question</a>
    <div class="dropdown-menu" aria-labelledby="addContent">
      <a class="dropdown-item" name="multipleChoice" @click="addQuestion({type: 'multiple-choice', sectionID: section._id, moduleID: module._id})">Multiple Choice</a>
      <a class="dropdown-item" name="trueFalse" @click="addQuestion({type: 'trueFalse', sectionID: section._id, moduleID: module._id})"> True or False</a>
      <a class="dropdown-item" name="openQuestion" @click="addQuestion({type: 'open-ended', sectionID: section._id, moduleID: module._id})"> Open Answer</a>
    </div>
    </div>
    <div v-for="(question, index) in module.content" :key="index" class="card w-75 m-3">
      <div class="card-body">
      <multipleChoice v-if="question.type === 'multiple-choice'" v-bind:question="question" v-bind:index="index" v-bind:section="section" v-bind:module="module" v-bind:answers="answers"/>
      <trueFalse v-else-if="question.type === 'trueFalse'" v-bind:question="question" v-bind:index="index" v-bind:section="section" v-bind:module="module" v-bind:answers="answers"/>
      <openQuestion v-else-if="question.type === 'open-ended'" v-bind:question="question" v-bind:index="index" v-bind:section="section" v-bind:module="module" v-bind:answers="answers"/>
      <div class="input-group">
      <div class="input-group-prepend"><span class="input-group-text">Relation</span></div>
        <select class="form-control input" v-model="question.relation">
          <option value="">...</option>
          <option v-for="(test, index) in relationCompute" :key="index" :value="test._id" :id="test.name">{{test.name}}</option>
        </select>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import multipleChoice from './multipleChoice'
import trueFalse from './trueFalse'
import openQuestion from './openQuestion'
export default {
  name: 'assessment',
  components: {
    multipleChoice,
    trueFalse,
    openQuestion
  },
  data () {
    return {
      newQuestion: {
        question: '',
        answer: '',
        choices: []
      },
      answers: []
    }
  },
  props: {
    module: Object,
    section: Object
  },
  methods: {
    ...mapActions({
      addQuestion: 'courses/createAssessmentContent',
      save: 'courses/updateAssessmentContent',
      removeQuestion: 'courses/deleteAssessmentContent',
      submit: 'user/submitAssessment'
    }),
    addIncorrectAnswer (index) {
      this.module.content[index].choices.push({ value: '' })
    },
    goBack () {
      this.$router.push({ name: 'course', params: { sectionID: this.section._id, moduleID: undefined } })
    },
    checkAnswer (index, question) {
      return this.userResponse.responses[index].correct
    },
    goToRelation (relationID) {
      this.$router.push({ name: 'course', params: { sectionID: this.section._id, moduleID: relationID } })
    }
  },
  computed: {
    ...mapGetters({
      course: 'courses/course',
      user: 'user/user',
      userCourses: 'user/userCourses'
    }),
    test: function () {
      const test = this.module.content.filter(ele => ele.value)
      return test
    },
    relationCompute: function () {
      const relate = this.section.modules.filter(ele => ele.type !== 'assessment')
      return relate
    },
    isSubmitted () {
      const course = this.userCourses.find(course => {
        if (course._id === this.$route.params.courseID) {
          return course
        }
      })
      const resultScore = course.results.find(result => {
        if (result._id === this.$route.params.moduleID) {
          return result
        }
      })
      if (typeof resultScore === 'undefined') {
        return false
      } else {
        return resultScore.submitted
      }
    },
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
      if (typeof result === 'undefined') {
        return { responses: [] }
      } else {
        return result
      }
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
