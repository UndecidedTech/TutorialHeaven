<template>
<div class="appBackground">
  <div class="flex-container">
    <div class="flexbox-item flexbox-item-1">
  <div id="myCarousel" class="col carousel slide" data-ride="carousel">
    <ol class="carousel-indicators">
      <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
      <li data-target="#myCarousel" data-slide-to="1"></li>
      <li data-target="#myCarousel" data-slide-to="2"></li>
    </ol>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img class="carouselImage" src="../assets/picture.jpg" alt="">
      </div>
      <div class="carousel-item">
        <img class="carouselImage" src="../assets/picture.jpg" alt="" >
      </div>
      <div class="carousel-item">
        <a href="www.google.com">
        <img class="carouselImage" src="../assets/picture.jpg" alt="">
        </a>
      </div>
    </div>
    <a class="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
  </div>
    <div class="flexbox-item flexbox-item-2">
      <div class="card bg-submit text-white">
        <img class="card-img-top" src="../assets/brain.png" alt="Card image cap">
          <div class="card-body">
            <h4 class="card-title font-weight-bold">Sign In </h4>
            <form>
              <div class="form-group">
                <label for="email">Email</label>
                <input v-model="user.email" type="email" id="email" class="form-control" placeholder="you@example.com">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input @keyup.enter="submit()" v-model="user.password" type="password" class="form-control" id="password" placeholder="password">

              </div>
            </form>
            <button @click="submit()" class="btn btn-success">Sign In</button>
          </div>
      </div>
    </div>

  </div>
</div>
</template>
<script>
import { mapActions } from 'vuex'
import axios from "axios";
export default {
  name: "homePage",
  components: {},
  data(){
    return {
      user: {
        email: "",
        password: ""
      }
    }
  },
  methods: {
    ...mapActions({
      signIn: 'auth/signIn'
    }),
    // async signIn() {
    //   const res = await axios.post("http://localhost:3000/api/users/signin",
    //     {
    //       email: this.user.email,
    //       password: this.user.password
    //     }
    //   )
    //   if(res.status === 200) {
    //     sessionStorage.setItem("userData", JSON.stringify(res.data));
    //     this.$router.push({path: "userDashboard"});
    //   }
    // }
    submit() {
      this.signIn(this.user).then(() => {
        this.$router.push({path: '/userDashboard'})
      }).catch(() => {
        alert('Failed to login')
      })
    }
    
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.flex-container {
  background: url(../assets/simple-codelines.svg),#2b3137;
  background-repeat: repeat;
  background-position: center;
  height: 600px;
  display: flex;
  justify-content: space-evenly; 

}
.flexbox-item {
  width: 300px;
  padding: 10px;
}
.flexbox-item-1 {
  overflow: hidden;
  width: 50%;
  max-height: 600px;
  align-self: flex-start;
}
.flexbox-item-2 {
  max-height: 500px;
}
.bg-submit {
  background-color: #24292e
}
.carousel-item {
  height: 550px;
}
</style>
