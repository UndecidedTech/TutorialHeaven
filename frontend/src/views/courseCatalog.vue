<template>
<div class="appBackground" style="padding: 10px;">
   <!-- <table  style="width:100%">
  <tr>
    <th>Course Name</th>
    <th>Course Subject</th>
    <th>Number of Students</th>
    <th>Number of Sections</th>
    <th>Course ID</th>
  </tr>
  <tr v-for="course in this.courseList" :key="course._id">
    <td>{{ course.name }}</td>
    <td>{{ course.subject }}</td>
    <td>{{ course.students.length }}</td>
    <td>{{ course.sections.length }}</td>
    <td>{{ course._id }}</td>
  </tr>
</table> -->
  <div class="row justify-content-end">
    <input type="text" class="form-control search-bar" placeholder="Search" aria-label="Search" @keyup="getCourseList({query: $event.target.value, subscribe: subscribe, enrolled: enrolled})">
     <button type="button" :class="subscribe === false ? 'btn btn-light filterBTN' : 'btn btn-info filterBTN'" data-toggle="button" aria-pressed="false" autocomplete="off" @click="subscribeToggle">
      Subscribed
    </button>
    <button type="button" :class="enrolled === false ? 'btn btn-light filterBTN' : 'btn btn-info filterBTN'" data-toggle="button" aria-pressed="false" autocomplete="off" @click="enrolledToggle">
      Enrolled
    </button>
  </div>
  <div class="card-flexbox">
  <div class="card flexbox-item" v-for="course in this.courseList" :key="course._id">
    <img class="card-img-top" :src="course.image" alt="Course Image" width="200" height="300">
  <div class="card-body">
    <h5 class="card-title">{{ course.name }}</h5>
    <p class="card-text">{{ course.description}}</p>
    <button class="btn btn-success" data-toggle="modal" data-target="#joinConfirmModal" @click="selectJoinCourse({courseID: course._id, name: course.name, subscription: course.subscription})">Join</button>
    <i v-if="course.subscription" class="fas fa-money-bill-alt fa-2x" style="float: right;color: green;"></i>
  </div>
    </div>
    </div>
  <div class="modal fade" tabindex="-1" id="joinConfirmModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Confirm Course Join</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
      </div>
      <div class="modal-body">
        <p>Do you want to <b><u>{{this.selectedCourse.name}}</u></b></p>
        <form v-if="this.selectedCourse.subscription">
          <div class="form-group">
            <label for="promoCode" class="col-form-label">Promo Code:</label>
            <input type="text" class="form-control" id="PromoCode" required>
          </div>
          <div class="form-group">
            <label for="payment" class="col-form-label">Payment:</label>
            <input class="form-control" id="payment" required>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-success" @click="joinCourse(selectedCourse)">Yes</button>
        <button type="button" data-dismiss="modal" class="btn btn-danger">No</button>
      </div>
    </div>
  </div>
</div>

</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'courseCatalog',
  components: {
  },
  data () {
    return {
      selectedCourse: {
        name: 'placeholder',
        subscription: false
      },
      subscribe: false,
      enrolled: false
    }
  },
  methods: {
    ...mapActions({
      getCourseList: 'courses/getCourseList',
      joinCourse: 'user/joinCourse'
    }),
    selectJoinCourse (course) {
      this.selectedCourse = course
    },
    subscribeToggle () {
      if (this.subscribe) {
        this.subscribe = false
      } else {
        this.subscribe = true
      }
    },
    enrolledToggle () {
      if (this.enrolled) {
        this.enrolled = false
      } else {
        this.enrolled = true
      }
    }
  },
  computed: {
    ...mapGetters({
      courseList: 'courses/courseList'
    })
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
.search-bar {
  width: 25%;
  margin: 10px;
}
.filterBTN {
  border-radius: 16px;
  margin: 5px;
}

.card-flexbox{
  border: gray 2px solid;
  border-radius: 20px;
  margin: auto;
  padding: 4px;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  width: 85%;
}
.flexbox-item {
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 27rem;
}
/* .flexbox-item {
  text-align: center;
  margin: 0px;
  padding: 0px;
  width: 25%;
} */
</style>
