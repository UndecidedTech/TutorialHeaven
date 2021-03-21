<template>
<div class="d-flex justify-content-center align-items-stretch">
  <div class="flexbox-item w-75">
      <h4 class="mb-3" style="text-align: center">Course Settings</h4>
      <img :src="course.image" alt="" class="img-thumbnail w-10 h-10 mb-3">
      <div id="avatarDiv" class="custom-file ml-4">
        <label for="avatar"  class="custom-file-label"></label>
        <input id="avatar" name="avatar" type="file" required >
      </div>
        <div class="row main-container">
          <div class="left-container">
            <div class="half-containers">
              <div class="form-group">
                <label for="courseName">Course Name</label>
                <input type="text" class="font-weight-bold form-control" id="courseName" name="courseName" placeholder="" :value="course.name" required>
              </div>
            </div>
            <div class="half-containers">
              <div class="card">
                <h5 class="card-header">Catagories <button class="btn btn-sm btn-primary float-right">Add</button></h5>
                <div v-for="(subject, index) in course.subjects" :key="index" class="card m-1"><div class="card-body m-2 p-0 th-center">{{subject}}<font-awesome-icon style="color: red;" class="float-right center icon m-2" :icon="['fas','times']"/></div></div>
              </div>
            </div>
          </div>
          <div class="right-container">
            <div class="form-group">
              <label for="description">Description</label>
              <div class="form-floating w-100 transTest"> <textarea class="form-control" placeholder="Leave a comment here" id="description" name="description" rows="10"></textarea></div>
            </div>
          </div>
        </div>
        <div class="card test" style="width: 100%;">
          <h5 class="card-header">Subjects <button class="btn btn-sm btn-primary float-right">Add</button></h5>
          <div v-for="(subject, index) in course.subjects" :key="index" class="card m-1"><div class="card-body m-2 p-0">{{subject}}<font-awesome-icon style="color: red;" class="float-right center icon m-2" :icon="['fas','times']"/></div></div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="card test" style="width: 100%;">
              <h5 class="card-header">Students <button class="btn btn-sm btn-primary float-right">Add</button></h5>
              <div v-for="(student, index) in studentsName" :key="index" class="card m-1"><div class="card-body m-2 p-0">{{student.name}}<font-awesome-icon style="color: red;" class="float-right center icon m-2" :icon="['fas','times']"/></div></div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="card test" style="width: 100%;">
              <h5 class="card-header">Instructors <button class="btn btn-sm btn-primary float-right">Add</button></h5>
              <div v-for="(instructor, index) in instructorsName" :key="index" class="card m-1"><div class="card-body m-2 p-0">{{instructor.name}}<font-awesome-icon style="color: red;" class="float-right center icon m-2" :icon="['fas','times']"/></div></div>
            </div>
            </div>
          </div>
      <button class="btn btn-success">Save Changes</button>
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
</div>
</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'courseSettings',
  components: {

  },
  data () {
    return {
      subjectInput: '',
      updates: {
        name: true
      }
    }
  },
  methods: {
    ...mapActions({
      postSubject: 'courses/postSubject',
      getUserNames: 'courses/getUserNames'
    }),
    cl (event) {
      console.log(event)
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
</style>
