<template>
<div class="flex-container">
  <div class="editor-sidebar d-flex flex-column justify-content-between" v-show="open">
    <div>
    <div class="p-4"><h1 class="d-inline">Menu</h1></div>
    <div class="list-group" id="list-tab" role="tablist">
      <div> <a class="list-group-item list-group-item-action pointer font-weight-bold" :class="[$route.matched[0].path == '/course/:courseID/:sectionID?/:moduleID?/:contentID?' ? 'th-active' : '']" id="sectionItem" role="tab" @click="$router.push({ name: 'course', params: { courseID: course._id } })">Sections</a> </div>
      <div> <a class="list-group-item list-group-item-action pointer font-weight-bold" :class="[$route.matched[0].path == '/course/:courseID/forum/:threadID' ? 'th-active' : '']" id="sectionItem" role="tab" @click="$router.push({ name: 'forum', params: { courseID: course._id } })">Forum</a> </div>
      <div> <a class="list-group-item list-group-item-action pointer font-weight-bold" :class="[$route.matched[0].path == '/course/:courseID/stats' ? 'th-active' : '']" id="sectionItem" role="tab" @click="$router.push({ name: 'courseStats', params: { courseID: course._id } })">Statistics</a> </div>
    </div>
    </div>
    <div> <a class="list-group-item list-group-item-action pointer fa-2x" :class="[$route.matched[0].path == '/course/:courseID/settings' ? 'th-active' : '']" @click="$router.push({ name: 'courseSettings', params: { courseID: course._id } })"><i class="fas fa-cogs"></i>  Settings</a></div>
  </div>
  <button class="th-sub d-inline" @click="shrink()"><i v-if="open" class="fas fa-angle-double-left"/><i v-else class="fas fa-angle-double-right"/></button>
  <div class="editor-item">
    <statsDashboard v-if="$route.matched[0].path == '/course/:courseID/stats'"/>
    <courseSettings v-else-if="$route.matched[0].path == '/course/:courseID/settings'"/>
    <forum v-else-if="$route.matched[0].path == '/course/:courseID/forum/:threadID?'"/>
    <sections v-else-if="!$route.params.sectionID && !$route.params.moduleID" :sections="course.sections"/>
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
import statsDashboard from '../views/statsDashboard'
import courseSettings from '../components/courseSettings'
import forum from '../views/forum'

export default {
  components: {
    sections,
    moduleContent,
    assessment,
    statsDashboard,
    courseSettings,
    forum
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
    console.log(this.$route.matched)
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
.th-sub {
  border:1px solid;
  position:relative;
  opacity:.3;
  right:0%;
  width: 25px;
  top:45vh;
  margin: 0;
  padding: 0;
  background-color: cadetblue;
}
.th-sub:hover {
  opacity:1;
}
.th-active {
  background-color: rgb(89, 177, 180);
  border-color: rgb(89, 177, 180);
}
.th-bottom{
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
