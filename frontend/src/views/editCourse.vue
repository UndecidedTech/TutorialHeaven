<template>
<div class="flex-container appBackground">
  <div class="editor-sidebar">
    <h1 class="d-inline">Sections</h1>
    <button class="btn btn-sm btn-primary float-right m-2" data-toggle="modal" data-target="#createSectionModal">+</button>
    <hr/>
    <draggable v-model="course.sections" group="sections" @start="drag=true" @end="drag=false" @update="updateCourse({courseID: course._id, field: 'sections', value: course.sections  })">
    <div v-for="(section, index) in this.course.sections" :key="section._id" class="list-group" id="list-tab" role="tablist">
      <a class="list-group-item list-group-item-action" id="sectionItem" @click="active(section._id, index)" :name="[[ section._id ]]" role="tab">{{ section.name }}</a>
    </div>
    </draggable>
  </div>
  <div class="editor-item">
      <!-- <div class="form-group">
        <label for="sectionName">Section Name</label><br/>
        <input type="text" id="sectionName" name="sectionName" v-model="sectionContent.name" @click="updateSection({sectionID: activeSection, field: 'name', value: $event.target.value})">
      </div>
      <br/>
      <input type="text" id="sectionContent" name="sectionContent" @change="updateSection({sectionID: activeSection, field: 'content', value: $event.target.value})">
      <button class="btn btn-success" @click="this.updateSection(updatedSection)">Update</button>
      <div class="form-group w-3">
        <label for="exampleFormControlTextarea1">Section Content</label>
        <textarea class="form-control" style="width: 50%" v-model="sectionContent.content" id="exampleFormControlTextarea1" rows="3" @change="updateSection({sectionID: activeSection, field: 'content', value: $event.target.value})"></textarea>
    </div> -->
    <!-- <modules v-bind:section="course.sections[sectionIndex]" v-bind:sectionIndex="sectionIndex"></modules> -->
    <component v-bind:section="course.sections[sectionIndex]" v-bind:sectionIndex="sectionIndex" v-bind:moduleIndex="moduleIndex" :is="dynamicComponent"/>
  </div>
  <div class="modal fade" id="createSectionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
import moduleContent from '../components/moduleContent'

export default {
  components: {
    draggable,
    modules,
    moduleContent
  },
  name: 'editCourse',
  data () {
    return {
      newSection: {
        name: '',
        courseID: this.$route.params.courseID
      },
      activeSection: 0,
      sectionIndex: 0,
      moduleIndex: 0
    }
  },
  methods: {
    ...mapActions({
      getCourse: 'courses/getCourse',
      createSection: 'courses/createSection',
      updateSection: 'courses/updateSection',
      updateCourse: 'courses/updateCourse'
    }),
    active (sectionID, index) {
      if ($(`a[name='${sectionID}']`).is('.active')) {
        $(`a[name='${sectionID}']`).removeClass('active')
        this.activeSection = ''
        this.sectionContent = {
          name: '',
          content: ''
        }
      } else {
        console.log(sectionID)
        $('#list-tab a').removeClass('active')
        $(`a[name='${sectionID}']`).addClass('active')
        this.sectionContent = this.course.sections.find(elem => elem._id === sectionID)
        this.sectionIndex = index
        this.activeSection = sectionID
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      course: 'courses/course',
      selectedModule: 'courses/selectedModule'
    }),
    dynamicComponent () {
      console.log(this.selectedModule)
      if (this.selectedModule) {
        return 'moduleContent'
      } else {
        return 'modules'
      }
    }
  },
  created () {
    this.getCourse(this.$route.params.courseID)
  },
  mounted () {
    this.active(this.course.sections[0]._id, 0)
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
</style>
