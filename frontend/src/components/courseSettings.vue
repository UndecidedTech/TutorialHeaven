<template>
<div class="d-flex justify-content-center align-items-stretch">
  <div class="flexbox-item w-75" :class="[isSaved() ? 'saved' : 'notSaved']">
      <h1 class="text-center mt-3">Course Settings</h1>
      <img v-show="!imgPreview" id="courseImage" :src="course.image" alt="" width="300px" height="400px" class="img-thumbnail mb-3">
      <img v-show="imgPreview" id="imagePreview" src="" alt="" width="300px" height="400px" class="img-thumbnail mb-3">
      <div id="avatarDiv" class="custom-file ml-4 w-50">
        <label for="avatar"  class="custom-file-label"></label>
        <input id="avatar" name="image" value="test" type="file" @change="updateMade($event.target.name), imagePreview($event.target.files[0])">
        <label class="custom-file-label" for="avatar">Choose file</label>
      </div>
        <div class="row main-container">
          <div class="left-container">
            <div class="half-containers">
              <div class="form-group">
                <label for="courseName">Course Name</label>
                <input type="text" class="font-weight-bold form-control" id="courseName" name="name" placeholder="" v-model="course.name" @change="updateMade($event.target.name)">
              </div>
            </div>
            <div class="half-containers">
              <div class="card">
                <h5 class="card-header">Categories <button class="btn btn-sm btn-primary float-right" data-toggle="modal" data-target="#addCategory">Add</button></h5>
                <div v-for="(category, index) in course.categories" :key="index" class="card m-1"><div class="card-body m-2 p-0 th-center">{{category}}<font-awesome-icon @click="removeItem('categories', category)" style="color: red;" class="float-right center icon m-2" :icon="['fas','times']"/></div></div>
              </div>
            </div>
          </div>
          <div class="right-container">
            <div class="form-group">
              <label for="description">Description</label>
              <div class="form-floating w-100"> <textarea class="form-control" v-model="course.description" placeholder="Leave a comment here" id="description" name="description" rows="10" @change="updateMade($event.target.name)"></textarea></div>
            </div>
          </div>
        </div>
        <div class="card test" style="width: 100%;">
          <h5 class="card-header">Subjects <button class="btn btn-sm btn-primary float-right" data-toggle="modal" data-target="#addSubject">Add</button></h5>
          <div v-for="(subject, index) in course.subjects" :key="index" class="card m-1"><div class="card-body m-2 p-0">{{subject}}<font-awesome-icon @click="removeItem('subjects', subject)" style="color: red;" class="float-right center icon m-2 pointer" :icon="['fas','times']"/></div></div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="card test" style="width: 100%;max-height: 300px;overflow: auto;">
              <h5 class="card-header">Students</h5>
              <div v-for="(student, index) in studentsName" :key="index" class="card m-1"><div class="card-body m-2 p-0">{{student.name}}<font-awesome-icon @click="removeItem('students', student._id)" style="color: red;" class="float-right center icon m-2 pointer" :icon="['fas','times']"/></div></div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="card test" style="width: 100%;">
              <h5 class="card-header">Instructors <button class="btn btn-sm btn-primary float-right" data-toggle="modal" data-target="#addInstructor">Add</button></h5>
              <div v-for="(instructor, index) in instructorsName" :key="index" class="card m-1"><div class="card-body m-2 p-0">{{instructor.name}}<font-awesome-icon @click="removeItem('instructors', instructor._id)" style="color: red;" class="float-right center icon m-2 pointer" :icon="['fas','times']"/></div></div>
            </div>
            </div>
          </div>
      <button class="btn btn-success" @click="saveSettings()">Save Changes</button>
      <span class="p-3"></span>
      <button class="btn btn-danger" data-toggle="modal" data-target="#deleteCourse">Delete Course</button>
      <div class="modal" tabindex="-1" role="dialog" id="deleteCourse">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Delete: {{course.name}}</h5>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete: {{course.name}}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger">Delete Course</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal" tabindex="-1" role="dialog" id="addCategory">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Category</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label for="newCategory">Category</label>
              <input id="newCategory" v-model="tempInput" type="text" name="category">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" data-dismiss="modal" @click="addItem('categories', tempInput)">Add</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal" tabindex="-1" role="dialog" id="addSubject">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Subject</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label for="newSubject">Subject</label>
              <input id="newSubject" type="text" name="subject" v-model="tempInput">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" data-dismiss="modal" @click="addItem('subjects', tempInput)">Add</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal" tabindex="-1" role="dialog" id="addInstructor">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Instructor</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label for="newInstructor">Instructor</label>
              <select class="form-control input" id="newInstructor">
              <option value="">...</option>
              <option v-for="(test, index) in _" :key="index" :value="test._id" :id="test.name">{{test.name}}</option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" data-dismiss="modal" @click="addItem('instructors', tempInput)">Add</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
</div>
</div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import $ from 'jquery'

export default {
  name: 'courseSettings',
  components: {

  },
  data () {
    return {
      imgPreview: false,
      update: {},
      tempInput: ''
    }
  },
  methods: {
    ...mapActions({
      postSubject: 'courses/postSubject',
      getUserNames: 'courses/getUserNames',
      updateSettings: 'courses/updateSettings'
    }),
    ...mapMutations({
      setUserList: 'courses/REM_FROM_USERSLIST',
      setCourseList: 'courses/REM_FROM_COURSE',
      addToCourse: 'courses/ADD_TO_COURSE',
      addUsernames: 'courses/ADD_USERNAMES'
    }),
    updateMade (type) {
      console.log(type)
      this.update[type] = true
      console.log(this.update)
    },
    imagePreview (file) {
      this.imgPreview = true
      console.log(file)
      const reader = new FileReader()
      reader.onload = function (e) {
        document.getElementById('imagePreview').src = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeItem (type, id) {
      this.update[type] = true
      console.log(this.update)
      if (type === 'instructors') {
        const indexList = this.instructorsName.findIndex(ele => ele._id === id)
        this.setUserList({ type, index: indexList })
        const index = this.course[type].findIndex(ele => ele === id)
        this.setCourseList({ type, index })
      } else if (type === 'students') {
        const indexList = this.studentsName.findIndex(ele => ele._id === id)
        this.setUserList({ type, index: indexList })
        const index = this.course[type].findIndex(ele => ele === id)
        this.setCourseList({ type, index })
      } else if (type === 'subjects') {
        const index = this.course[type].findIndex(ele => ele === id)
        this.setCourseList({ type, index })
      } else if (type === 'categories') {
        const index = this.course[type].findIndex(ele => ele === id)
        this.setCourseList({ type, index })
      }
    },
    addItem (type, value) {
      console.log(value)
      this.update[type] = true
      console.log('update: ', this.update)
      if (type === 'instructors') {
        this.addUsernames({ type, value })
        this.addToCourse({ type, value })
      } else if (type === 'students') {
        this.addToCourse({ type, value })
      } else if (type === 'subjects') {
        console.log(value)
        this.addToCourse({ type, value })
      } else if (type === 'categories') {
        this.addToCourse({ type, value })
      }
    },
    isSaved () {
      if (Object.keys(this.update).length === 0) {
        return true
      }
      return false
    },
    async saveSettings () {
      console.log('frontend', this.update)
      const res = await this.updateSettings(this.update)
      if (res.status === 200) {
        this.update = {}
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      course: 'courses/course',
      studentsName: 'courses/students',
      instructorsName: 'courses/instructors'
    })
  },
  created () {
    this.getUserNames(this.$route.params.courseID)
  },
  mounted () {
    $('.modal').on('hide.bs.modal', (evt) => {
      this.tempInput = ''
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.flexbox-item {
  width: 35%;
  padding: 10px;
  overflow: hidden;
  max-height: 100%;
  align-self: center;
}
#avatarDiv {
  width: 65%;
}
.icon {
  vertical-align: text-bottom !important;
}
.test {
  margin-top: 16px;
}
.th-center {
  vertical-align: middle;
}

.main-container {
  height: 100%;
  display: flex;
}

.right-container {
  flex: 1 1 0;
  margin-left: 2em;
  margin-right: 1em;
}

.left-container {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  margin-left: 1em;
}

.half-containers {
  flex: 1;
}

.saved {
  border: #28a745 solid 3px;
  border-radius: 10px;
}
.notSaved {
  border: #dc3545 solid 3px;
  border-radius: 10px;
}
</style>
