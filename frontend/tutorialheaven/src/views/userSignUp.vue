<template>
    <div class="appBackground">
      <div class="flex-container">
        <div class="flexbox-item">
          <div class="card bg-submit">
            <div class="card-body">
              <h4 class="card-title font-weight-bold">Sign Up </h4>
              <form>
                 <div class="form-group">
                  <label for="fName">First Name</label>
                  <input v-model="user.firstname" type="text" id="fName" class="form-control">
                </div>
                 <div class="form-group">
                  <label for="lName">Last Name</label>
                  <input v-model="user.lastname" type="text" id="lName" class="form-control">
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input v-model="user.email" type="email" id="email" class="form-control"
                    placeholder="example@email.com">
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input v-model="user.password" type="password" class="form-control" id="password"
                    placeholder="password">
                </div>
              </form>
              <button @click="checkUserValue()" class="btn btn-success">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'userSignUp',
  data () {
    return {
      user: {
        password: null,
        firstname: null,
        lastname: null,
        email: null
      }
    }
  },
  methods: {
    ...mapActions({
      signUp: 'user/signUp'
    }),
    checkUserValue () {
      if (!this.user.password) { return alert('Fill Required fields') } else if (!this.user.firstname) { return alert('Fill Required fields') } else if (!this.user.lastname) { return alert('Fill Required fields') } else { this.signUp(this.user) }
    }
  }
}
</script>

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
