<template>
<div>
  <div class="p-4">
    <h1 class="d-inline m-3">Sections</h1>
    <button v-if="course.instructors.includes(user._id)" class="btn btn-primary float-right" data-toggle="modal" data-target="#createSectionModal">Add Section</button>
    <div v-if="course.instructors.includes(user._id)">
    <draggable v-if="course.instructors.includes(user._id)" v-model="course.sections" group="sections" @start="drag=true" @end="drag=false" @update="updateCourse({courseID: course._id, field: 'sections', value: course.sections  })">
    <section v-for="(section, index) in course.sections" :key="index" class="card align-self-center mr-0" style="width: auto;margin: 20px;">
        <div class="card-body">
            <div><b>{{ section.name }}</b>
            <div class="float-right" data-toggle="tooltip" data-placement="top" title="Dropdown">
                <font-awesome-icon :icon="expanded[section._id] === true ? ['fas', 'arrow-up' ] : ['fas', 'arrow-down']" data-toggle="collapse" :data-target="'#section'+section._id" aria-expanded="false" aria-controls="collapseExample"/>
              </div>
            <button v-if="course.instructors.includes(user._id)" class="mr-4 btn btn-primary float-right" data-toggle="modal" data-target="#createModule" @click="$router.push({name: 'course', params: { courseID: $route.params.courseID, sectionID: section._id }})"> Add Module </button>
            </div>
            <hr>
            <div class="collapse show" :id="'section'+section._id">
            <div v-for="(module, index) in section.modules" :key="index" class="card-title border border-dark rounded pl-2 pt-3 pb-3">
              <div v-if="module.type === 'content'">
                <div class="pl-2 big fa fa-book"></div>
                <div class="d-inline pl-1" @click="$emit('enterModule',section._id, module._id, module.type), enterModule(section._id, module._id)"> {{ module.name }}</div>
                <button v-if="course.instructors.includes(user._id)" class="btn btn-sm btn-danger float-right mr-3" @click="deleteModule({courseID: course._id, sectionID: section._id, moduleID: module._id})">Remove</button>
              </div>
              <div v-else>
                <i class="pl-2 big fa fa-file-alt"/>
                <div class="d-inline pl-1" @click="$emit('enterModule',section._id, module._id, module.type), enterModule(section._id, module._id)"> {{ module.name }}</div>
                <button v-if="course.instructors.includes(user._id)" class="btn btn-sm btn-danger float-right mr-3" @click="deleteModule({courseID: course._id, sectionID: section._id, moduleID: module._id})">Remove</button>
              </div>
            </div>
            </div>
        </div>
    </section>
    </draggable>
    </div>
    <div class="pr-4" v-else v-for="(section, index) in course.sections" :key="index">
      <section v-if="loaded" class="card align-self-center" style="width: auto;margin: 20px;">
          <div class="card-body">
              <div class=""><b>{{ section.name }}</b>
              <div class="float-right" data-toggle="tooltip" data-placement="top" title="Dropdown">
                <font-awesome-icon :icon="expanded[section._id] === true ? ['fas', 'arrow-down' ]: ['fas', 'arrow-up']" @click="expandSection(`section${section._id}`)" data-toggle="collapse" :data-target="'#section'+section._id" aria-expanded="false" aria-controls="collapseExample"/>
              </div>
              </div>
              <hr>
              <div class="collapse show" :id="'section'+section._id">
              <div v-for="(module, index) in section.modules" :key="index" class="card-title border border-dark rounded pl-2 pt-3 pb-3">
                <div  v-if="module.type === 'content'" @click="$emit('enterModule',section._id, module._id, module.type), enterModule(section._id, module._id)">
                  <div class="pl-2 big fa fa-book"></div>
                  <div class="d-inline pl-1"> {{ module.name }}</div>
                </div>
                <div v-else @click="$emit('enterModule',section._id, module._id, module.type), enterModule(section._id, module._id)">
                  <i class="pl-2 big fa fa-file-alt"/>
                  <div class="d-inline pl-1"> {{ module.name }}</div>
                  <div v-if="!course.instructors.includes(user._id)" class="float-right mr-3" >{{ setScore(module._id).value}}</div>
                </div>
              </div>
              </div>
          </div>
      </section>
    </div>
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
          <label for="select">Type</label>
          <select id="select" class="form-control" v-model="type">
            <option value="assessment">Assessment</option>
            <option value="content">Content</option>
          </select>
        </div>
        <div class="modal-footer">
          <button type="button" @click="addModule({name, description, type, courseID: course._id, sectionID: $route.params.sectionID})" data-dismiss="modal" class="btn btn-primary">Create</button>
        </div>
      </div>
    </div>
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
import $ from 'jquery'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import draggable from 'vuedraggable'
export default {
  name: 'sections',
  components: {
    draggable
  },
  data () {
    return {
      name: '',
      description: '',
      type: '',
      newSection: {
        name: '',
        courseID: this.$route.params.courseID
      },
      arrowPosition: [],
      expanded: {},
      loaded: false
    }
  },
  methods: {
    ...mapMutations({
      selectModule: 'courses/SET_SELECTEDMODULE'
    }),
    ...mapActions({
      addModule: 'courses/createModule',
      deleteModule: 'courses/deleteModule',
      createSection: 'courses/createSection',
      updateCourse: 'courses/updateCourse'
    }),
    enterModule (sID, mID) {
      this.$router.push({ name: 'course', params: { sectionID: sID, moduleID: mID } })
    },
    setScore (moduleID) {
      const course = this.userCourses.find(course => {
        if (course._id === this.$route.params.courseID) {
          return course
        }
      })
      const resultScore = course.results.find(result => {
        if (result._id === moduleID) {
          return result
        }
      })
      console.log(resultScore)
      if (typeof resultScore !== 'undefined') {
        if (typeof resultScore.score === 'undefined') {
          return { value: 'Not Started', submitted: resultScore.submitted }
        } else {
          return { value: resultScore.score, submitted: resultScore.submitted }
        }
      } else {
        return { value: 'Not Started', submitted: false }
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      course: 'courses/course',
      userCourses: 'user/userCourses'
    })
  },
  created () {
    this.course.sections.forEach((section) => {
      this.$set(this.expanded, section._id, true)
    })

    this.loaded = true
  },
  mounted () {
    this.course.sections.forEach((section) => {
      console.log('section', section._id)
      $(`#section${section._id}`).on('show.bs.collapse hide.bs.collapse', (e) => {
        console.log('event: ', e.target.id.slice(7))
        const currId = e.target.id.slice(7)

        this.expanded[currId] = !this.expanded[currId]
        console.log(this.expanded[currId])
      })
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.card-title:hover {
  cursor: pointer;
  color: white;
  background-color: rgb(89, 177, 180);
}
.big {
  font-size: 25px;
  text-align: center;
}
</style>
