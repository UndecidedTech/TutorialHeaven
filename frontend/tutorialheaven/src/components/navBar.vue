<template>
<header>
 <nav class="navbar navbar-expand-lg navbar-light bg-nav">
  <a class="navbar-brand text-white mb-0 h1">TutorialHeaven</a>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto text-white">
      <li class="nav-item active">
        <a @click="goHome()" class="nav-link text-white" >
          <i class="fas fa-home"/>
        </a>
      </li>
      <li class="nav-item">
        <a @click="goTimeline()" class="nav-link text-white" >Timeline</a>
      </li>
    </ul>
    <div class="nav-item dropdown">
        <a class="nav-link dropdown-toggle text-white"  id="navbarDropdown" role="button" data-toggle="dropdown">
          <i class="fas fa-user"/>
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" @click="goProfile()"><i class="fas fa-user"/> Profile Settings</a>
          <a class="dropdown-item" >My Timelines</a>
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
  methods: {
      signOut(){
        axios.get("http://localhost:5000/api/users/signout")
        this.$router.push({path: 'login'})
      },
      goHome(){
        this.$router.push({path: '/'})
      },
      goTimeline(){
        this.$router.push({path: 'timeline'})
      },
      goProfile(){
        this.$router.push({path: 'profile'})
      }
  }
}
</script>

<style scoped lang="css" >
body {margin: 0;}
.bg-nav {background-color:#24292e;}

</style>
