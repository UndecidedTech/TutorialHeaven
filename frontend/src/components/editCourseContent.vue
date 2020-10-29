<template>
<div class="appBackground">
  <div class="dropdown show pt-2 pr-2 pl-4 float-right">
    <a class="btn btn-info dropdown-toggle" role="button" id="addContent" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Add Content</a>
    <div class="dropdown-menu" aria-labelledby="addContent">
      <a class="dropdown-item" name="text" @click="addContent({type: $event.target.name, sectionID: section._id})"> Add Text</a>
      <a class="dropdown-item" name="image" @click="addContent({type: $event.target.name, sectionID: section._id})"> Add Image</a>
      <a class="dropdown-item" name="video" @click="addContent({type: $event.target.name, sectionID: section._id})"> Add Video</a>
      <a class="dropdown-item" name="assessment" @click="addContent({type: $event.target.name, sectionID: section._id})"> Add Assessment</a>
    </div>
  </div>
  <div class="editor">
  <draggable v-model="course.sections[sectionIndex].content" group="content" @start="drag=true" @end="drag=false" @update="updateSection({courseID: course._id, sectionID: course.sections[sectionIndex]._id, field: 'content', value: course.sections[sectionIndex].content})">
  <div class="form-group" v-for="(content, index) in course.sections[sectionIndex].content" :key="index">
    <div class="editor-item" v-if="content.type === 'text'">
      <label for="exampleFormControlTextarea1">Text Content</label>
      <button class=" btn btn-sm btn-primary float-right" @click="updateSectionContent({sectionID: section._id, field: 'text', value: content.value , contentID: content._id})"> Save </button>
      <vue-editor v-model="content.value"></vue-editor>
      <!-- <textarea class="form-control" style="width: 100%" v-model="content.value" id="exampleFormControlTextarea1" rows="3" @change="updateSectionContent({sectionID: section._id, field: 'text', value: $event.target.value, contentID: content._id})"></textarea> -->
    </div>
    <div class="editor-item" v-else-if="content.type === 'image'">
      <input type="text" v-model="content.value" @change="updateSectionContent({sectionID: section._id, value: $event.target.value, contentID: content._id})">
      <img v-bind:src="content.value" alt="test" class="img-thumbnail w-25 h-25 mb-3">
    </div>
    <div class="editor-item" v-else-if="content.type === 'video'">
      <input type="text" v-model="content.value" @change="updateSectionContent({sectionID: section._id, value: $event.target.value, contentID: content._id})">
      <iframe width="560" height="315" v-bind:src="content.value" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="editor-item" v-else-if="content.type === 'file'"></div>
  </div>
  </draggable>
  </div>
</div>
</template>
<script>
import { VueEditor } from 'vue2-editor'
import { mapActions, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
export default {
  name: 'editCourseContent',
  components: {
    draggable,
    VueEditor
  },
  props: {
    section: Object,
    sectionIndex: Number
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions({
      updateSectionContent: 'courses/updateSectionContent',
      addContent: 'courses/createSectionContent',
      updateSection: 'courses/updateSection'
    })
  },
  computed: {
    ...mapGetters({
      course: 'courses/course'
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.editor {
  display: flex;
  flex-flow: column;
  align-items: stretch;
}
.editor-item {
  border: 1px solid gray;
}
.editor textarea {
  flex-basis: 50%;
}

</style>
