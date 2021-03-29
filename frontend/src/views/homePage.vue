<template>
<div>
  <div class="flex-container pt-5">
  <div class="flexbox-item flexbox-item-1">
    <div id="myCarousel" class="col carousel slide p-0" data-ride="carousel">
      <div class="carousel-inner">
        <div v-for="(test, index) in courseList" :key="index" class="carousel-item" :class="[index === 0 ? 'active' : '']">
          <img class="carouselImage" width="100%" height="100%" :src="test.image">
          <div class="carousel-caption caption p-2 pointer" @click="$router.push({ name: 'courseCatalog' })">
            <h5>{{ test.name }}</h5>
            <p class="m-0">{{ test.description }}</p>
          </div>
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
                <input v-model="user.email" type="email" id="email" class="form-control" placeholder="you@example.com" required>
                <div id="emailInvalid" class="invalid-feedback">
                  Please provide an Email
                </div>
                <div class="valid-feedback">
                  Email has been sent
                </div>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input @keyup.enter="submit()" v-model="user.password" type="password" class="form-control" id="password" placeholder="password">
              </div>
            </form>
            <button @click="submit()" class="btn btn-success">Sign In</button>
            <button @click="forgot()" class="btn btn-primary ml-3">Forgot Password</button>
          </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'homePage',
  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      emailForm: undefined,
      carouselList: []
    }
  },
  methods: {
    ...mapActions({
      signIn: 'user/signIn',
      getCourseList: 'courses/getCourseList'

    }),
    getCarouselList () {
      for (let i = 0; i <= this.courseList.length; i++) {
        this.carouselList.push(this.courseList[i])
      }
      return this.carouselList
    },
    submit () {
      this.signIn(this.user).then(() => {
        this.$router.push({ path: '/userDashboard' })
      }).catch(() => {
        alert('Failed to login')
      })
    },
    async forgot () {
      const invalidDiv = document.getElementById('emailInvalid')
      if (this.user.email !== '' && this.user.email.includes('@')) {
        const res = await axios.post('/api/users/forgot', {
          email: this.user.email
        }).catch(error => { // handle user not found error
          if (error.response) {
            invalidDiv.innerText = 'Email cannot be found'
            this.emailForm.classList.remove('is-valid')
            this.emailForm.classList.add('is-invalid')
          }
        })

        if (res.status === 200) {
          this.emailForm.classList.remove('is-invalid')
          this.emailForm.classList.add('is-valid')
        }
      } else {
        invalidDiv.innerText = 'Please provide an Email'
        this.emailForm.classList.remove('is-valid')
        this.emailForm.classList.add('is-invalid')
      }
    }
  },
  computed: {
    ...mapGetters({
      courseList: 'courses/courseList'
    })
  },
  mounted () {
    this.emailForm = document.getElementById('email')
  },
  watch: {
    getCourse: {
      immediate: true,
      handler () {
        this.getCourseList()
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.flex-container {
  background: url(../assets/simple-codelines.svg),#2b3137;
  /* background:black; */
  background-repeat: repeat;
  background-position: center;
  height: calc(100vh - 58px);
  display: flex;
  justify-content: space-evenly;
  overflow-y: hidden;
}
.flexbox-item {
  width: 300px;
}
.flexbox-item-1 {
  overflow: hidden;
  width: 50%;
  max-height: 600px;
  align-self: flex-start;
}
.flexbox-item-2 {
  align-self: flex-start;
  width: 300px;
  max-height: 600px;
}
.bg-submit {
  background-color: #24292e
}
.carousel-item {
  height: 550px;
}
.caption {
  background-color: rgba(43, 49, 55, .8);
  border-radius: 30px;
}
.slide {
  border: 10px solid #24292e;
}
</style>
