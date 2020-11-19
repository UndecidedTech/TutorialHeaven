<template>
<div>
  <button class="btn btn-primary mb-3" @click="goBack">Return</button>
  <div class="float-right mb-3">
  <button class="btn btn-success" v-if="course.instructors.includes(user._id)" @click="save({sectionID: section._id, moduleID: module._id, value: module.content})">Save</button>
  </div>
  <div id="student" v-if="!course.instructors.includes(user._id)">
    <div v-for="(question, index) in module.content" :key="index" class="pl-3">
      <multipleChoice v-if="question.type === 'multiple-choice'" v-bind:question="question" v-bind:index="index"/>
      <trueFalse v-else-if="question.type === 'trueFalse'" v-bind:question="question" v-bind:index="index"/>
    </div>
    test: {{ test }}
    <button class="btn btn-danger float-right mt-3 mr-3" @click="submit({responses: test, courseID: $route.params.courseID, sectionID: $route.params.sectionID, moduleID: $route.params.moduleID})">Submit</button>
  </div>
  <div id="instructor" v-else>
    <div class="dropdown show pt-2 pr-2 pl-4 float-right">
    <a class="btn btn-primary dropdown-toggle" role="button" id="addContent" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Add Question</a>
    <div class="dropdown-menu" aria-labelledby="addContent">
      <a class="dropdown-item" name="multipleChoice" @click="addQuestion({type: 'multiple-choice', sectionID: section._id, moduleID: module._id})">Multiple Choice</a>
      <a class="dropdown-item" name="trueFalse" @click="addQuestion({type: 'trueFalse', sectionID: section._id, moduleID: module._id})"> True or False</a>
    </div>
    </div>
    <div v-for="(question, index) in module.content" :key="index">
      <multipleChoice v-if="question.type === 'multiple-choice'" v-bind:question="question" v-bind:index="index" v-bind:section="section" v-bind:module="module" v-bind:answers="answers"/>
      <trueFalse v-else-if="question.type === 'trueFalse'" v-bind:question="question" v-bind:index="index" v-bind:section="section" v-bind:module="module" v-bind:answers="answers"/>
      <div class="input-group">
      <div class="input-group-prepend"><span class="input-group-text">Relation</span></div>
        <select class="form-control input">
          <option value="">...</option>
          <option v-for="(test, index) in section.modules" :key="index" :value="test._id" :id="test.name" >{{test.name}}</option>
        </select>
      </div>
      <hr/>
    </div>
  </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import multipleChoice from './multipleChoice'
import trueFalse from './trueFalse'
export default {
  name: 'assessment',
  components: {
    multipleChoice,
    trueFalse
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
      this.$router.push(this.$router.push({ name: 'course', params: { sectionID: this.section._id, moduleID: undefined } }))
    }
  },
  computed: {
    ...mapGetters({
      course: 'courses/course',
      user: 'user/user'
    }),
    test: function () {
      const test = this.module.content.filter(ele => ele.value)
      return test
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
