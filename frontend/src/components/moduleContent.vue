<template>
<div class="appBackground">
  <div v-if="course.instructors.includes(user._id)">
  <button class="btn btn-primary" @click="selectModule({type: '', index: 0})">Return</button>
  <div class="editor">
  <draggable v-model="course.sections[sectionIndex].modules[moduleIndex].content" group="content" @start="drag=true" @end="drag=false" @update="updateSection({courseID: course._id, sectionID: course.sections[sectionIndex]._id, field: 'content', value: course.sections[sectionIndex].content})"> -->
  <div class="form-group" v-for="(content, index) in section.modules[moduleIndex].content" :key="index">
    <div class="editor-item">
      <label for="exampleFormControlTextarea1">Text Content</label>
      <button class=" btn btn-sm btn-primary float-right" @click="updateModuleContent({sectionID: section._id, moduleID:section.modules[moduleIndex]._id, field: 'text', value: content.value , contentID: content._id})"> Save </button>
      <vue-editor v-model="content.value"></vue-editor>
    <!-- </div>
    <div class="editor-item" v-else-if="content.type === 'image'">
      <input type="text" v-model="content.value" @change="updateSectionContent({sectionID: section._id, value: $event.target.value, contentID: content._id})">
      <img v-bind:src="content.value" alt="test" class="img-thumbnail w-25 h-25 mb-3">
    </div>
    <div class="editor-item" v-else-if="content.type === 'video'">
      <input type="text" v-model="content.value" @change="updateSectionContent({sectionID: section._id, value: $event.target.value, contentID: content._id})">
      <iframe width="560" height="315" v-bind:src="content.value" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="editor-item" v-else-if="content.type === 'file'"></div> -->
  </div>
  </div>
  </draggable>
  </div>
</div>
<div v-else>
<button class="btn btn-primary" @click="selectModule({type: '', index: 0})">Return</button>
<div class="editor">
<div class="form-group" v-for="(content, index) in section.modules[moduleIndex].content" :key="index">
    <div class="editor-item" v-if="content.type === 'text'">
      <label for="exampleFormControlTextarea1">Text Content</label>
      <!-- <vue-editor v-model="content.value" :editor-toolbar="customToolbar"></vue-editor> -->
      <div v-html="content.value"></div>
    </div>
    <div class="editor-item" v-else-if="content.type === 'image'">
      <input type="text" v-model="content.value">
      <img v-bind:src="content.value" alt="test" class="img-thumbnail w-25 h-25 mb-3">
    </div>
    <div class="editor-item" v-else-if="content.type === 'video'">
      <input type="text" v-model="content.value">
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
import { mapActions, mapGetters, mapMutations } from 'vuex'
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
    moduleIndex: Number
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations({
      selectModule: 'courses/SET_SELECTEDMODULE'
    }),
    ...mapActions({
      updateModuleContent: 'courses/updateModuleContent',
      addContent: 'courses/createModuleContent',
      updateSection: 'courses/updateSection'
    })
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
}
.editor-item {
  border: 1px solid gray;
}
.editor textarea {
  flex-basis: 50%;
}

</style>
