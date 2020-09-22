<template>
  <body>
    <div class="flex-container">
      <div class="flexbox-item">
          <h4 class="mb-3" style="text-align: center">Profile Information</h4>
          <form class="needs-validation" novalidate>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="firstName">First name</label>
                <input type="text" class="font-weight-bold form-control" id="firstName" placeholder="" :value="[[user.firstname]]" required>
                <div class="invalid-feedback">
                  Valid first name is required.
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="lastName">Last name</label>
                <input type="text" class="font-weight-bold form-control" id="lastName" placeholder="" :value="[[user.lastname]]" required>
                <div class="invalid-feedback">
                  Valid last name is required.
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label for="email">Email </label>
              <input type="email" class="font-weight-bold form-control" id="email" :value="[[user.email]]">
            </div>
          </form>
      </div>
    </div>
  </body>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
axios.defaults.withCredentials = true
export default {
  name: 'userProfile',
  data () {
    return {
    }
  },
  methods: {

  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
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

</style>
