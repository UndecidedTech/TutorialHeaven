<template>
<div>
  <button class="btn btn-primary mb-3" @click="selectModule({type: '', index: 0})">Return</button>
  <div class="float-right mb-3">
  <button class="btn btn-success" v-if="course.instructors.includes(user._id)" @click="save({sectionID: section._id, moduleID: module._id, value: module.content})">Save</button>
  </div>
  <div id="student" v-if="!course.instructors.includes(user._id)">
    <div class="ml-3" v-for="(question, index) in module.content" :key="index">
      <span>{{ question.question }}</span>
      <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input" :id="index" name="option">
        <label class="custom-control-label" :for="index"> {{ question.answer }}</label>
      </div>
      <div v-for="(incorrectAnswer, index) in question.choices" :key="index">
        <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input" :id="index+20" name="option">
        <label class="custom-control-label" :for="index+20"> {{ incorrectAnswer.value }}</label>
      </div>
      </div>
    </div>
  </div>
  <div id="instructor" v-else>
    <button class="btn btn-primary" @click="addQuestion({type: 'multiple-choice', sectionID: section._id, moduleID: module._id})">Add Question</button>
    <div v-for="(question, index) in module.content"  :key="index">
      <div class="input-group-prepend">
        <span class="input-group-text">Question</span>
      </div>
      <input v-model="question.question" type="text" name="question" class="form-control">
      <div class="input-group-prepend">
        <span class="input-group-text">Answer</span>
      </div>
      <input v-model="question.answer" type="text" name="answer" class="form-control">
      <button @click="addIncorrectAnswer(index)">Add Incorrect Answer</button>
      <div v-for="(incorrectAnswer, index) in question.choices" :key="index">
      <div class="input-group-prepend">
        <span class="input-group-text">Wrong Answer</span>
      </div>
      <input v-model="incorrectAnswer.value" type="text" name="wronganswer" class="form-control">
      </div>
      {{ module.content[index] }}
    </div>
  </div>
    <!-- <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">Question</span>
      </div>
      <input type="text" name="question" class="form-control">
      <div class="input-group-prepend">
        <span class="input-group-text">Answer</span>
      </div>
      <input type="text" name="answer" class="form-control">
      <div class="input-group-prepend">
        <span class="input-group-text">Wrong Answer</span>
      </div>
      <input type="text" name="wronganswer" class="form-control">
    </div>
  </div> -->
</div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  name: 'assessment',
  data () {
    return {
      newQuestion: {
        question: '',
        answer: '',
        choices: []
      }
    }
  },
  props: {
    module: Object,
    section: Object
  },
  methods: {
    ...mapMutations({
      selectModule: 'courses/SET_SELECTEDMODULE'
    }),
    ...mapActions({
      addQuestion: 'courses/createAssessmentContent',
      save: 'courses/updateAssessmentContent'
    }),
    addIncorrectAnswer (index) {
      this.module.content[index].choices.push({ value: '' })
    }
  },
  computed: {
    ...mapGetters({
      course: 'courses/course',
      user: 'user/user'
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
</style>
