<template>
<div class="flex-container appBackground">
  <div class="editor-sidebar">
    <h1 class="d-inline">Sections</h1>
    <button class="btn btn-sm btn-primary float-right m-2" data-toggle="modal" data-target="#createSectionModal">+</button>
    <hr/>
    <div v-for="(section, index) in this.course.sections" :key="index" class="list-group" id="list-tab" role="tablist">
      <a class="list-group-item list-group-item-action" id="sectionItem" @click="active(section._id, index)" :name="[[ section._id ]]" role="tab">{{ section.name }}</a>
    </div>
  </div>
  <div class="editor-item">
    <div class="form-group">
      <label for="sectionName">Section Name</label><br/>
      <input type="text" id="sectionName" name="sectionName" :value="sectionContent.name" @click="updateSection({sectionID: activeSection, field: 'name', value: $event.target.value})">
    </div>
    <br/>
    <!-- <input type="text" id="sectionContent" name="sectionContent" @change="updateSection({sectionID: activeSection, field: 'content', value: $event.target.value})"> -->
    <!-- <button class="btn btn-success" @click="this.updateSection(updatedSection)">Update</button> -->
    <div class="form-group w-3">
      <label for="exampleFormControlTextarea1">Section Content</label>
      <textarea class="form-control" style="width: 50%" v-model="sectionContent.content" id="exampleFormControlTextarea1" rows="3" @change="updateSection({sectionID: activeSection, field: 'content', value: $event.target.value})"></textarea>
  </div>
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
      sectionContent: {
        name: '',
        content: ''
      },
      activeSection: 0
    }
  },
  methods: {
    ...mapActions({
      getCourse: 'courses/getCourse',
      createSection: 'courses/createSection',
      updateSection: 'courses/updateSection'
    }),
    active (sectionID, sectionIndex) {
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
        this.sectionIndex = sectionIndex
        this.activeSection = sectionID
        // console.log(this.activeSection)
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
  },
  mounted () {
    this.active(this.course.sections[0]._id)
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
