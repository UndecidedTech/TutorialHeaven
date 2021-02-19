<template>
<div class="flex-container">
  <div class="editor-sidebar" v-show="open">
    <div class="p-4"><h1 class="d-inline">Menu</h1></div>
    <div class="list-group" id="list-tab" role="tablist">
      <div> <a class="list-group-item list-group-item-action pointer" id="sectionItem" role="tab" @click="$router.push({ name: 'forum', params: { courseID: course._id } })">Forum</a> </div>
      <div> <a class="list-group-item list-group-item-action pointer" id="sectionItem" role="tab">Statistics</a> </div>
    </div>
  </div>
  <button class="sub d-inline" @click="shrink()"><i class="fas fa-angle-double-left" v-if="open"/><i class="fas fa-angle-double-right" v-else/></button>
  <div class="editor-item">
    <sections v-if="!$route.params.sectionID && !$route.params.moduleID" :sections="course.sections"/>
    <component v-else v-bind:section="course.sections[courseInfo.sectionIndex]" v-bind:sectionIndex="courseInfo.sectionIndex" v-bind:module="course.sections[courseInfo.sectionIndex].modules[courseInfo.moduleIndex]" v-bind:moduleIndex="courseInfo.moduleIndex" :is="componentRender" />
  </div>
  <div v-if="course.instructors.includes(user._id)" class="modal fade" id="createSectionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Create Section</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <label for="courseName">Section Name</label>
          <input v-model="newSection.name" id="sectionName" type="text" class="form-control" required>
        </div>
        <div class="modal-footer">
          <button type="button" @click="createSection(newSection)" data-dismiss="modal" class="btn btn-primary">Create</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import sections from '../components/sections'
import assessment from '../components/assessment'
import moduleContent from '../components/moduleContent'

export default {
  components: {
    sections,
    moduleContent,
    assessment
  },
  name: 'course',
  data () {
    return {
      newSection: {
        name: '',
        courseID: this.$route.params.courseID
      },
      open: true,
      activeSection: 0
    }
  },
  methods: {
    ...mapActions({
      getCourse: 'courses/getCourse',
      createSection: 'courses/createSection',
      updateSection: 'courses/updateSection',
      updateCourse: 'courses/updateCourse',
      deleteSection: 'courses/deleteSection',
      getThreads: 'forum/getThreads'
    }),
    shrink () {
      if (this.open) {
        this.open = false
      } else {
        this.open = true
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      course: 'courses/course',
      selectedModule: 'courses/selectedModule'
    }),
    courseInfo: function () {
      if (this.$route.params.sectionID) {
        const test = {
          sectionIndex: this.course.sections.findIndex(i => i._id === this.$route.params.sectionID)
        }
        if (this.$route.params.moduleID) {
          test.moduleIndex = this.course.sections[test.sectionIndex].modules.findIndex(i => i._id === this.$route.params.moduleID)
        }
        if (this.$route.params.contentID) {
          test.contentIndex = this.course.sections[test.sectionIndex].modules[test.moduleIndex].content.findIndex(i => i._id === this.$route.params.contentID)
        }
        return test
      } else {
        return 0
      }
    },
    componentRender: function () {
      if (this.$route.params.moduleID) {
        if (this.course.sections[this.courseInfo.sectionIndex].modules[this.courseInfo.moduleIndex].type === 'content') {
          return 'moduleContent'
        } else {
          return this.course.sections[this.courseInfo.sectionIndex].modules[this.courseInfo.moduleIndex].type
        }
      } else {
        return 'sections'
      }
    }
  },
  created () {
    this.getCourse(this.$route.params.courseID)
    this.getThreads(this.$route.params.courseID)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.flex-container {
    min-height: 93.7vh;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
}
.editor-sidebar {
  align-self: stretch;
  width: 15%;
  border-right: 3px solid rgba(136, 133, 133, 0.534);
}
.editor-item {
    flex-grow: 1;
    align-self: stretch;
}
.list-group-item:hover {
  background-color: rgb(89, 177, 180);
  border-color: rgb(89, 177, 180);
}
.sub {
  border:1px solid;
  position:relative;
  opacity:30%;
  right:0%;
  width: 25px;
  top:45vh;
  margin: 0;
  padding: 0;
  background-color: cadetblue;
}
.sub:hover {
  opacity:100%;
}
</style>
