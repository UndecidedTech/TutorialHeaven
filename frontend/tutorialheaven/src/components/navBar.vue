<template>
<header>
 <nav class="navbar navbar-expand-lg navbar-dark bg-nav">
  <a class="navbar-brand text-white mb-0 h1">TutorialHeaven</a>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto text-white">
      <li class="nav-item active">
        <button @click="goHome()" class="btn nav-link text-white" >
          <i class="fas fa-home"/>
        </button>
      </li>
    </ul>
    <button @click="goSignUp()" class="signupBtn btn btn-success">Sign Up</button>
    <div v-if="userData" id="userProfile" class="nav-item dropdown">
        <a class="dropdown-toggle text-white" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
           <!-- <i class="fas fa-user"/> -->
           <img :src="userData.avi" id="userAvatar" class="rounded-circle" width="25" height="25">
           <span class="caret"></span>
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item" @click="goProfile()"><i class="fas fa-user"/> Profile Settings</a>
          <div class="dropdown-divider"></div>
          <a @click="signOut()" class="dropdown-item"><i class="fas fa-sign-out-alt"/> Logout</a>
        </div>
      </div>
   </div>
</nav>
</header>
</template>

<script>
import axios from "axios"
export default {
  name: 'navBar',
  data() {
    return {
      userData: JSON.parse(sessionStorage.getItem("userData"))
    }
  },
  methods: {
      goHome(){
        this.$router.push({path: '/'})
      },
      goProfile(){
        this.$router.push({path: 'userProfile'})
      },
      goSignUp(){
        this.$router.push({path: "userSignUp"});
      }
  }
}
</script>

<style scoped lang="css" >
.bg-nav {
  background-color:#24292e;
}
.signupBtn{
  margin-right: 10px;
}
.dropdown-toggle {
  cursor: pointer;
}

</style>
