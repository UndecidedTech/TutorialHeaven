<template>
<div class="appBackground">
  <button class="btn btn-primary" @click="goBack">Return</button>
  <div v-if="course.instructors.includes(user._id)">
  <div class="dropdown show pt-2 pr-2 pl-4 float-right">
    <a class="btn btn-info dropdown-toggle" role="button" id="addContent" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Add Content</a>
    <div class="dropdown-menu" aria-labelledby="addContent">
      <a class="dropdown-item" name="text" @click="addContent({type: $event.target.name, sectionID: section._id, moduleID: course.sections[sectionIndex].modules[moduleIndex]._id})"> Add Text</a>
      <a class="dropdown-item" name="image" @click="addContent({type: $event.target.name, sectionID: section._id, moduleID: course.sections[sectionIndex].modules[moduleIndex]._id})"> Add Image</a>
      <a class="dropdown-item" name="video" @click="addContent({type: $event.target.name, sectionID: section._id, moduleID: course.sections[sectionIndex].modules[moduleIndex]._id})"> Add Video</a>
    </div>
    </div>
  <div class="editor">
  <draggable v-model="course.sections[sectionIndex].modules[moduleIndex].content" group="content" @start="drag=true" @end="drag=false" @update="updateModule({courseID: course._id, sectionID: section._id, moduleID: section.modules[moduleIndex]._id, field: 'content', value: section.modules[moduleIndex].content})">
  <div class="form-group" v-for="(content, index) in section.modules[moduleIndex].content" :key="index">
    <div class="editor-item" v-if="content.type === 'text'">
      <label for="exampleFormControlTextarea1">Text Content</label>
      <button class=" btn btn-sm btn-primary float-right" @click="updateModuleContent({sectionID: section._id, moduleID:section.modules[moduleIndex]._id, field: 'text', value: content.value , contentID: content._id})"> Save </button>
      <button class="btn btn-danger btn-sm float-right" @click="deleteModuleContent({sectionID: section._id, moduleID:section.modules[moduleIndex]._id, contentID: content._id})">Remove</button>
      <vue-editor v-model="content.value"></vue-editor>
    </div>
    <div class="editor-item" v-else-if="content.type === 'image'">
      <input type="text" v-model="content.value" @change="updateModuleContent({sectionID: section._id, moduleID:section.modules[moduleIndex]._id, value: $event.target.value, contentID: content._id})">
      <img v-bind:src="content.value" alt="test" class="img-thumbnail w-25 h-25 mb-3">
      <button class="btn btn-danger btn-sm float-right" @click="deleteModuleContent({sectionID: section._id, moduleID:section.modules[moduleIndex]._id, contentID: content._id})">Remove</button>
    </div>
    <div class="editor-item" v-else-if="content.type === 'video'">
      <input type="text" v-model="content.value" @change="updateModuleContent({sectionID: section._id, moduleID:section.modules[moduleIndex]._id, value: $event.target.value, contentID: content._id})">
      <iframe width="560" height="315" v-bind:src="content.value" frameborder="0" allowfullscreen></iframe>
      <button class="btn btn-danger btn-sm float-right" @click="deleteModuleContent({sectionID: section._id, moduleID:section.modules[moduleIndex]._id, contentID: content._id})">Remove</button>
    </div>
    <div class="editor-item" v-else-if="content.type === 'file'"></div>
  </div>
  </draggable>
  </div>
  </div>
<div v-else>
<div class="editor">
<div class="title">{{ module.name }}</div>
<div class="form-group" v-for="(content, index) in section.modules[moduleIndex].content" :key="index">
    <div class="editor-item" v-if="content.type === 'text'">
      <div v-html="content.value"></div>
    </div>
    <div class="editor-item" v-else-if="content.type === 'image'">
      <img v-bind:src="content.value" alt="test" class="img-thumbnail w-25 h-25 mb-3">
    </div>
    <div class="editor-item" v-else-if="content.type === 'video'">
      <iframe width="560" height="315" v-bind:src="content.value" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="editor-item" v-else-if="content.type === 'file'"></div>
  </div>
</div>
</div>
</div>
</template>
<script>
import { VueEditor } from 'vue2-editor'
import { mapActions, mapGetters } from 'vuex'
import draggable from 'vuedraggable'

export default {
  name: 'moduleContent',
  components: {
    draggable,
    VueEditor
  },
  props: {
    section: Object,
    sectionIndex: Number,
    moduleIndex: Number,
    module: Object
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions({
      updateModuleContent: 'courses/updateModuleContent',
      addContent: 'courses/createModuleContent',
      updateModule: 'courses/updateModule',
      deleteModuleContent: 'courses/deleteModuleContent'
    }),
    goBack () {
      this.$router.push(this.$router.push({ name: 'course', params: { sectionID: this.section._id, moduleID: undefined } }))
    }
  },
  computed: {
    ...mapGetters({
      course: 'courses/course',
      user: 'user/user',
      selectedModule: 'courses/selectedModule'
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
  max-width: 100vw;
}
.editor-item {
  border: 1px solid gray;
  margin: 10px;
}
.editor textarea {
  flex-basis: 50%;
}
.title {
  margin: 5px;
  font-size: 35px;
  font-weight: bolder;
}

</style>
