<template>
  <body>
    <div class="flex-container">
      <div class="flexbox-item">
          <h4 class="mb-3" style="text-align: center">Profile Information</h4>
          <img :src="[[user.avi]]" alt="" class="img-thumbnail w-25 h-25 mb-3">
          <div id="avatarDiv" class="custom-file ml-4">
            <input id="avatar" name="avatar" type="file" required class="custom-file-input" @change="userUpload">
            <label for="avatar" class="custom-file-label"></label>
          </div>
          <form class="needs-validation" novalidate>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="firstName">First name</label>
                <input type="text" class="font-weight-bold form-control" id="firstName" placeholder="" :value="[[user.firstname]]" @change="updateUserDetails(user._id, 'firstname', $event.target.value)" required>
                <div class="invalid-feedback">
                  Valid first name is required.
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="lastName">Last name</label>
                <input type="text" class="font-weight-bold form-control" id="lastName" placeholder="" :value="[[user.lastname]]" @change="updateUserDetails(user._id, 'lastname', $event.target.value)" required>
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
  <div class="modal fade" id="changePassword" tabindex="-1" role="dialog" aria-labelledby="exampleModal3Label" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" >Change Password</h5>
      </div>
      <div class="modal-body">
        <input type="password" name="changePassword" id="changePassword">
      </div>
      <div class="modal-footer">
        <button class="btn btn-success">Change Password</button>
      </div>
    </div>
  </div>
</div>
  </body>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'userProfile',
  data () {
    return {
    }
  },
  methods: {
    ...mapActions({
      userUpload: 'user/onUserUpload'
    }),
    updateUserDetails (userId, fieldName, updatedValue) {
      this.$store.dispatch('user/updateField', { userId, fieldName, updatedValue })
    }

  },
  computed: {
    ...mapGetters({
      user: 'user/user'
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
