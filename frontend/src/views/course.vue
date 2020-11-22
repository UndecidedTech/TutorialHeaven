<template>
<div class="flex-container appBackground">
  <div class="editor-sidebar" v-show="open">
    <h1 class="d-inline">Sections</h1>
    <button v-if="course.instructors.includes(user._id)" class="btn btn-sm btn-primary float-right m-2" data-toggle="modal" data-target="#createSectionModal">+</button>
    <hr/>
    <draggable v-if="course.instructors.includes(user._id)" v-model="course.sections" group="sections" @start="drag=true" @end="drag=false" @update="updateCourse({courseID: course._id, field: 'sections', value: course.sections  })">
    <div v-for="(section, index) in this.course.sections" :key="section._id" class="list-group" id="list-tab" role="tablist">
      <div> <a class="list-group-item list-group-item-action" id="sectionItem" @click="active(section._id, index)" :name="[[ section._id ]]" role="tab">{{ section.name }}</a> <button v-if="course.instructors.includes(user._id)" class="btn btn-sm btn-danger" @click="deleteSection({courseID: course._id, sectionID: section._id})">Remove</button></div>
    </div>
    </draggable>
    <div v-else>
      <div v-for="(section, index) in this.course.sections" :key="section._id" class="list-group" id="list-tab" role="tablist">
      <div> <a class="list-group-item list-group-item-action" id="sectionItem" @click="active(section._id, index)" :name="[[ section._id ]]" role="tab">{{ section.name }}</a> </div>
    </div>
    </div>
  </div>
  <button class="sub btn btn-sm btn-secondary" @click="shrink()"><i class="fas fa-angle-double-left" v-if="open"/><i class="fas fa-angle-double-right" v-else/></button>
  <div class="editor-item">
    <component v-if="shitInfo.sectionIndex >= 0" v-bind:section="course.sections[shitInfo.sectionIndex]" v-bind:sectionIndex="shitInfo.sectionIndex" v-bind:module="course.sections[shitInfo.sectionIndex].modules[shitInfo.moduleIndex]" v-bind:moduleIndex="shitInfo.moduleIndex" :is="componentRender" />
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
import $ from 'jquery'
import draggable from 'vuedraggable'
import modules from '../components/modules'
import assessment from '../components/assessment'
import moduleContent from '../components/moduleContent'

export default {
  components: {
    draggable,
    modules,
    assessment,
    moduleContent
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
      deleteSection: 'courses/deleteSection'
    }),
    active (sectionID, index) {
      if ($(`a[name='${sectionID}']`).is('.active')) {
        $(`a[name='${sectionID}']`).removeClass('active')
        this.activeSection = ''
        this.$router.push({ name: 'course', params: { courseID: this.course._id } })
      } else {
        console.log(sectionID)
        $('#list-tab a').removeClass('active')
        $(`a[name='${sectionID}']`).addClass('active')
        this.activeSection = sectionID
        this.$router.push({ name: 'course', params: { sectionID: sectionID } })
      }
    },
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
    shitInfo: function () {
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
        return false
      }
    },
    componentRender: function () {
      if (this.$route.params.moduleID) {
        if (this.course.sections[this.shitInfo.sectionIndex].modules[this.shitInfo.moduleIndex].type === 'content') {
          return 'moduleContent'
        } else {
          return this.course.sections[this.shitInfo.sectionIndex].modules[this.shitInfo.moduleIndex].type
        }
      } else {
        return 'modules'
      }
    }
  },
  created () {
    this.getCourse(this.$route.params.courseID)
  },
  mounted () {
    if (!this.$route.params.sectionID) {
      this.$router.push({ name: 'course', params: { sectionID: this.course.sections[0]._id } })
      $(`a[name='${this.$route.params.sectionID}']`).addClass('active')
    }
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
  width: 20%;
  border-right: 3px solid rgba(136, 133, 133, 0.534);
}
.editor-item {
    flex-grow: 1;
    align-self: stretch;
}
.list-group-item.active {
  background-color: rgb(89, 177, 180);
  border-color: rgb(89, 177, 180);
}
.sub{
    border:1px solid;
    position:relative;
    right:0px;
    top: 45vh;
    color: black;
}
</style>
