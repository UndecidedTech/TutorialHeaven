<template>
<div>
  <div id="instructor" v-if="course.instructors.includes(user._id)">
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">Question</span>
      </div>
      <input class="w-25" type="text" v-model="question.question">
    </div>
    <div>
      <select class="custom-select custom-select-sm select" v-model="question.answer">
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
    {{ question }}
  </div>
  <div id="student" v-else>
   <span class="font-weight-bold">{{ question.question }}</span>
      <div class="custom-control custom-radio">
        <input  type="radio" class="custom-control-input" id="true" name="trueFalse">
        <label class="custom-control-label" for="true">True</label>
      </div>
      <div class="custom-control custom-radio">
        <input  type="radio" class="custom-control-input" id="false" name="trueFalse">
        <label class="custom-control-label" for="false">False</label>
      </div>
      <hr/>
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
    module: Object
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
</style>
