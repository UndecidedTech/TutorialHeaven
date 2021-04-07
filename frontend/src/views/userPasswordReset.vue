<template>
  <div class="appBackground">
    <div class="flex-container" v-if="!expired">
      <div class="flexbox-item">
        <div class="card bg-submit">
          <div class="card-body">
            <h4 class="card-title font-weight-bold">Sign Up </h4>
            <form>
                <div class="form-group">
                <label for="password">Password</label>
                <input v-model="newPassword" type="password" id="password" class="form-control">
              </div>
                <div class="form-group">
                <label for="lName">Confirm Password</label>
                <input v-model="confirmPassword" type="password" id="confirm" class="form-control">
              </div>
            </form>
            <button @click="resetPassword()" class="btn btn-success">Submit</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>
        This token has expired or is invalid
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'userReset',
  data () {
    return {
      newPassword: '',
      confirmPassword: '',
      expired: false,
      formDiv: undefined
    }
  },
  methods: {
    async checkResetLink () {
      await axios.get(`/api/users/reset/${this.$route.params.token}`)
        .catch(error => {
          if (error.response) {
            this.expired = true
          }
        })
    },
    async resetPassword () {
      if (this.newPassword !== '' && this.confirmPassword !== '' && this.newPassword === this.confirmPassword) {
        const res = await axios.post(`/api/users/reset/${this.$route.params.token}`, {
          password: this.newPassword
        })

        if (res.status === 200) {
          this.$router.push({ name: 'homePage' })
        }
      }
    }
  },
  mounted () {
    this.checkResetLink()
  }
}
</script>

<style>
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
