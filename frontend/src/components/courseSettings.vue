<template>
<div>
  <div class="flex-container">
      <div class="flexbox-item">
          <h4 class="mb-3" style="text-align: center">Course Settings</h4>
          <img :src="[[user.avi]]" alt="" class="img-thumbnail w-25 h-25 mb-3">
          <div id="avatarDiv" class="custom-file ml-4">
            <label for="avatar"  class="custom-file-label"></label>
            <input id="avatar" name="avatar" type="file" required class="custom-file-input" @change="userUpload">
          </div>
          <form class="needs-validation" novalidate>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="firstName">Coure Name</label>
                <input type="text" class="font-weight-bold form-control" id="firstName" placeholder="" :value="course.name" @change="updateUserDetails(user._id, 'firstname', $event.target.value)" required>
                <div class="invalid-feedback">
                  Valid first name is required.
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="lastName">Description</label>
                <textarea name="" id="" cols="30" rows="10"></textarea>
                <div class="invalid-feedback">
                  Valid last name is required.
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label for="email">Email </label>
              <input type="email" class="font-weight-bold form-control" id="email" :value="[[user.email]]" @change="updateUserDetails(user._id, 'email', $event.target.value)">
            </div>
          </form>
          <button class="btn btn-success">Update Profile</button>
          <span class="p-3"></span>
          <button class="btn btn-danger" data-toggle="modal" data-target="#changePassword">Update Password</button>
      </div>
    </div>
  <input type="text" name="subject" id="subjectInput" v-model="subjectInput">
  <button class="btn btn-success" @click="postSubject({courseID: course._id, subject: subjectInput})">Submit</button>
  <div v-for="(subject, index) in course.subjects" :key="index">{{subject}}</div>
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
      subjectInput: ''
    }
  },
  methods: {
    ...mapActions({
      postSubject: 'courses/postSubject'
    }),
    cl (event) {
      console.log(event)
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
.flex-container {
  display: flex;
  justify-content: space-evenly;
}
.flexbox-item {
  width: 35%;
  padding: 10px;
  overflow: hidden;
  max-height: 600px;
  align-self: center;
}
#avatarDiv {
  width: 65%;
}
</style>
