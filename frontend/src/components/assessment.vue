<template>
<div>
  <button class="btn btn-primary" @click="selectModule({type: '', index: 0})">Return</button>
  <div id="student" v-if="!course.instructors.includes(user._id)">
    <div v-for="(question, index) in multipleChoiceAssessment" :key="index">
      <span>{{ question.question }}</span>
      <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input" :id="index" name="option">
        <label class="custom-control-label" :for="index"> {{ question.answer }}</label>
      </div>
      <div v-for="(incorrectAnswer, index) in question.incorrectAnswers" :key="index">
        <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input" :id="index+20" name="option">
        <label class="custom-control-label" :for="index+20"> {{ incorrectAnswer.value }}</label>
      </div>
      </div>
    </div>
  </div>
  <div id="instructor" v-else>
    <button class="btn btn-primary" @click="addQuestion">Add Question</button>
    <div v-for="(question, index) in multipleChoiceAssessment"  :key="index">
      <div class="input-group-prepend">
        <span class="input-group-text">Question</span>
      </div>
      <input v-model="question.question" type="text" name="question" class="form-control">
      <div class="input-group-prepend">
        <span class="input-group-text">Answer</span>
      </div>
      <input v-model="question.answer" type="text" name="answer" class="form-control">
      <button @click="addIncorrectAnswer(index)">Add Incorrect Answer</button>
      <div v-for="(incorrectAnswer, index) in question.incorrectAnswers" :key="index">
      <div class="input-group-prepend">
        <span class="input-group-text">Wrong Answer</span>
      </div>
      <input v-model="incorrectAnswer.value" type="text" name="wronganswer" class="form-control">
      </div>
      {{ question }}
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
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'assessment',
  data () {
    return {
      multipleChoiceAssessment: []
    }
  },
  methods: {
    ...mapMutations({
      selectModule: 'courses/SET_SELECTEDMODULE'
    }),
    addQuestion () {
      this.multipleChoiceAssessment.push({
        question: '',
        answer: '',
        incorrectAnswers: []
      })
    },
    addIncorrectAnswer (index) {
      this.multipleChoiceAssessment[index].incorrectAnswers.push({ value: '' })
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
