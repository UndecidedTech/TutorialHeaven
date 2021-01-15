<template>
<header>
 <nav class="navbar navbar-expand-lg navbar-dark bg-nav">
  <a @click="goHome()" class="navbar-brand btn p-0 text-white mb-0 h1">TutorialHeaven</a>
  <div class="vl">|</div>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto text-white">
      <li class="nav-item active" v-if="authenticted">
        <button @click="goDashboard()" class="btn nav-link text-white">
          <i class="fas fa-home"/>
        </button>
      </li>
      <li class="nav-item active">
        <button @click="goCatalogue()" class="btn nav-link text-white">Catalogue</button>
      </li>
    </ul>
    <button v-if="!authenticated" @click="goSignUp()" class="signupBtn btn btn-success">Sign Up</button>
    <div v-if="user" id="userProfile" class="nav-item dropdown">
        <a class="dropdown-toggle text-white" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
           <!-- <i class="fas fa-user"/> -->
           <img :src="user.avi" id="userAvatar" class="rounded-circle" width="35" height="31">
           <span class="caret"></span>
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item" @click="goProfile()"><i class="fas fa-user"/> Profile Settings</a>
          <a class="dropdown-item" @click="goStats()"><i class="fas fa-chart-line"/> Statistics</a>
          <div class="dropdown-divider"></div>
          <a @click="logOut()" class="dropdown-item"><i class="fas fa-sign-out-alt"/> Logout</a>
        </div>
      </div>
   </div>
</nav>
</header>
</template>

<script>
// import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'navBar',
  data () {
    return {
    }
  },
  methods: {
    ...mapActions({
      signOut: 'signOut'
    }),
    goHome () {
      this.$router.push({ name: 'homePage' })
    },
    goProfile () {
      this.$router.push({ name: 'userProfile' })
    },
    goSignUp () {
      this.$router.push({ name: 'userSignUp' })
    },
    goDashboard () {
      this.$router.push({ name: 'userDashboard' })
    },
    goStats () {
      this.$router.push({ name: 'statsDashboard' })
    },
    logOut () {
      this.signOut()
    },
    goCatalogue () {
      this.$router.push({ name: 'courseCatalogue' })
    }
  },
  computed: {
    ...mapGetters({
      authenticated: 'user/authenticated',
      user: 'user/user'
    })
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
.vl {
  border-left: 2px solid white;
  margin-right: 10px;
}

</style>
