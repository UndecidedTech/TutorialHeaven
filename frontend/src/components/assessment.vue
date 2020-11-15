<template>
<div>
  <button class="btn btn-primary mb-3" @click="selectModule({type: '', index: 0})">Return</button>
  <div class="float-right mb-3">
  <button class="btn btn-success" v-if="course.instructors.includes(user._id)" @click="save({sectionID: section._id, moduleID: module._id, value: module.content})">Save</button>
  </div>
  <div id="student" v-if="!course.instructors.includes(user._id)">
    <div v-for="(question, index) in module.content" :key="index">
      <multipleChoice v-if="question.type === 'multiple-choice'" v-bind:question="question" v-bind:index="index"/>
      <trueFalse v-else-if="question.type === 'trueFalse'" v-bind:question="question" v-bind:index="index"/>
    </div>
    <!-- <div class="ml-3" v-for="(question, index) in module.content" :key="index">
      <span class="font-weight-bold">{{ question.question }}</span>
      <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input" :id="index" :name="option+index">
        <label class="custom-control-label" :for="index"> {{ question.answer }}</label>
      </div>
      <div v-for="(incorrectAnswer, index) in question.choices" :key="index">
        <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input" :id="incorrectAnswer.value" :name="question.id">
        <label class="custom-control-label" :for="incorrectAnswer.value"> {{ incorrectAnswer.value }}</label>
      </div>
      </div>
      <hr/>
    </div> -->
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
      <multipleChoice v-if="question.type === 'multiple-choice'" v-bind:question="question" v-bind:index="index" v-bind:section="section" v-bind:module="module"/>
      <trueFalse v-else-if="question.type === 'trueFalse'" v-bind:question="question" v-bind:index="index" v-bind:section="section" v-bind:module="module"/>
    </div>
    <!-- <div v-for="(question, index) in module.content"  :key="index">
      <button class="btn btn-danger" @click="removeQuestion({sectionID: section._id, moduleID: module._id, contentID: question._id})"> Remove Question</button>
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
      {{ module.content[index] }}
    </div> -->
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
      user: 'user/user'
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.input {
  max-width: 600px;
}
</style>
