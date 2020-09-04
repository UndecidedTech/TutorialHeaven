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
            <h4 class="card-title font-weight-bold">Sign Up </h4>
            <form>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" class="form-control" placeholder="example@email.com">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="password">

              </div>
            </form>
            <button class="btn btn-success">Sign Up for TutorailHeaven</button>
          </div>
      </div>
    </div>

  </div>
</div>
</template>
<script>
export default {
  name: "homePage",
  components: {},
  methods: {
    
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
