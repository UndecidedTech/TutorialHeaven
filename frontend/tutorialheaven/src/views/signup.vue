<template>
    <div>
      <div class="flex-container">
        <div class="flexbox-item">
          <div class="card bg-submit">
            <div class="card-body">
              <h4 class="card-title font-weight-bold">Sign In </h4>
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
              <button @click="signUp()" class="btn btn-success">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from "axios";
    export default {
        name: "signUp",
        data() {
            return {
                user: {
                    username: "",
                    password: "",
                    firstname: "",
                    lastname: ""
                }
            }
        },
        methods: {
          checkUserValue() {
            if (!this.user.username)
              return false;
            else if (!this.user.password)
              return false;
            else if (!this.user.firstname)
              return false
            else if (!this.user.lastname)
              return false;
            else
              return true;  
          },
          async signUp() {
            if (this.checkUserValue()){
              const res = await axios.post("http://localhost:3000/api/users/signup", {...this.user});
              if (res.status === 200){
                sessionStorage.setItem("userData", JSON.stringify(res.data));
                this.$router.push("/dashboard");
              }
            }
          }
        }
    }
</script>

<style scoped lang="css">
.flex-container {
  height: 600px;
  display: flex;
  justify-content: space-evenly; 

}
.flexbox-item {
  width: 300px;
  padding: 10px;
  overflow: hidden;
  width: 50%;
  max-height: 600px;
  align-self: center;
}
</style>