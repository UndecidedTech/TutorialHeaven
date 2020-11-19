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
    {{ question }}
  </div>
  <div id="student" v-else>
   <span class="font-weight-bold">{{index + 1}}. {{ question.question }}</span>
      <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input" id="true" name="trueFalse" value="true" v-model="question.value">
        <label class="custom-control-label" for="true">True</label>
      </div>
      <div class="custom-control custom-radio">
        <input type="radio" class="custom-control-input" id="false" value="false" name="trueFalse" v-model="question.value">
        <label class="custom-control-label" for="false">False</label>
      </div>
      {{ question }}
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
    answers: Array
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
      user: 'user/user'
    })
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
