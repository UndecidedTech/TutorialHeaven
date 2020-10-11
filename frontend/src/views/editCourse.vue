<template>
<div class="flex-container appBackground">
  <div class="editor-sidebar">
    <h1 class="d-inline">Sections</h1>
    <button class="btn btn-danger float-right" data-toggle="modal" data-target="#createSectionModal">+</button>
    <hr/>
    <div v-for="(section, index) in this.course.sections" :key="index" class="list-group" id="list-tab" role="tablist">
      <a class="list-group-item list-group-item-action" id="sectionItem" @click="active($event, section._id, index)" :name="[[ section._id ]]" role="tab">{{ section.name }}</a>
    </div>
  </div>
  <div class="editor-item">
    <input type="text" name="sectionName" :placeholder="activeSection.name" @change="updatedSection.sectionID = activeSection._id, updatedSection.name = $event.target.value">
    <input type="text" name="sectionContent" :placeholder="activeSection.content" @change="updatedSection.content = $event.target.value">
    {{updatedSection.name}} {{updatedSection.content}}
    <button class="btn btn-success" @click="updateSection(updatedSection)">Update</button>
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

export default {
  name: 'editCourse',
  data () {
    return {
      newSection: {
        name: '',
        courseID: this.$route.params.courseID
      },
      activeSection: {},
      updatedSection: {
        courseID: this.$route.params.courseID,
        sectionID: '',
        name: null,
        content: 'This is content'
      }
    }
  },
  methods: {
    ...mapActions({
      getCourse: 'courses/getCourse',
      createSection: 'courses/createSection',
      updateSection: 'courses/updateSection'
    }),
    active (event, sectionID, sectionIndex) {
      if ($(event.target).is('.active')) {
        $(event.target).removeClass('active')
        this.activeSection = ''
      } else {
        $('#list-tab a').removeClass('active')
        $(event.target).addClass('active')
        console.log('This is the section index', sectionIndex)
        this.activeSection = this.course.sections[sectionIndex]
        console.log(this.activeSection)
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      course: 'courses/course'
    })
  },
  created () {
    this.getCourse(this.$route.params.courseID)
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
    border: 2px solid #5e0d0d;
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
