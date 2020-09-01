<template>
  <body>
    <div class="container">
      <div class="row">
        <div class="col-md-8 order-md-1">
          <h4 class="mb-3" style="text-align: center">Profile Information</h4>
          <form class="needs-validation" novalidate>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="firstName">First name</label>
                <input  type="text" class="form-control" id="firstName" placeholder="" value="" required>
                <div class="invalid-feedback">
                  Valid first name is required.
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="lastName">Last name</label>
                <input type="text" class="form-control" id="lastName" placeholder="" value="" required>
                <div class="invalid-feedback">
                  Valid last name is required.
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="username">Username</label>
              <div class="input-group">
                <input type="text" class="form-control" id="username" placeholder="Username" required>
              </div>
            </div>

            <div class="mb-3">
              <label for="email">Email </label>
              <input type="email" class="form-control" id="email" placeholder="you@example.com">
            </div>
          </form>
        </div>
      </div>
    </div>
  </body>
</template>
<script>
import axios from "axios"
axios.defaults.withCredentials = true;
export default {
  name: "profile",
  data: function() {
    return {
      user: {}
    }
  },
  methods: {
    async getUserData() {
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        withCredentials: true
      });
    }
  },
  mounted: function() {
    this.getUserData()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.container {
  max-width: 960px;
}

.border-top { border-top: 1px solid #e5e5e5; }
.border-bottom { border-bottom: 1px solid #e5e5e5; }
.border-top-gray { border-top-color: #adb5bd; }

.box-shadow { box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05); }

.lh-condensed { line-height: 1.25; }
</style>
