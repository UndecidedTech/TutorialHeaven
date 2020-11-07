<template>
<div>
  <div>
    <h1 class="d-inline" style="padding-left: 10px; padding-top: 30px;">Modules</h1>
    <button v-if="course.instructors.includes(user._id)" class="btn btn-primary float-right" data-toggle="modal" data-target="#createModule"> Add Module </button>
    <hr/>
    <section class="card align-self-center" style="width: auto;margin: 20px;">
        <div class="card-body">
            <p class=""><b>{{ section.name }}</b>: {{ section.description }}</p>
            <hr/>
            <p v-for="(module, index) in section.modules" :key="index" class="card-title border border-dark rounded pl-2 pt-3 pb-3"><i v-if="module.type === 'content'" class="pl-2 fa fa-book"/> <i v-else class="pl-2 far fa-file-alt"/> <b @click="enterModule(index, module.type)">{{ module.name }}</b><button class="btn btn-sm btn-danger float-right mr-3" @click="deleteModule({courseID: course._id, sectionID: section._id, moduleID: module._id})">Remove</button></p>
        </div>
    </section>
</div>
<div class="modal fade" id="createModule" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Create Module</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <label for="moduleName">Module Name</label>
          <input id="moduleName" v-model="name" type="text" class="form-control" required>
          <label for="moduleDescription">Module Description</label>
          <input id="moduleDescription" v-model="description" type="text" class="form-control" required>
          <select v-model="type">
            <option value="assessment">Assessment</option>
            <option value="content">Content</option>
          </select>
        </div>
        <div class="modal-footer">
          <button type="button" @click="addModule({name, description, type, courseID: course._id, sectionID: section._id})" data-dismiss="modal" class="btn btn-primary">Create</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'modules',
  data () {
    return {
      name: '',
      description: '',
      type: ''
    }
  },
  props: {
    section: Object,
    sectionIndex: Number
  },
  methods: {
    ...mapMutations({
      selectModule: 'courses/SET_SELECTEDMODULE'
    }),
    ...mapActions({
      addModule: 'courses/createModule',
      deleteModule: 'courses/deleteModule'
    }),
    enterModule (index, type) {
      this.selectModule({
        type: type,
        index: index
      })
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      course: 'courses/course'
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.card-title:hover {
  cursor: pointer;
  color: white;
  background-color: #007bff;
}
</style>
