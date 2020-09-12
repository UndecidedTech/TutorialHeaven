<template>
    <div class="appBackground">
        <div class="flex-container">
            <div class="dashboard-sidebar">
                <h1>Classes</h1>
                <hr/>
                <a href="">&#129488 Class 1</a><br/>
                <a href="">&#129488 Class 2</a><br/>
               

            </div>
            <div class="notification-item">
                <h1 style="padding-left: 10px; padding-top: 30px;">Notifications</h1>
                <hr/>
                <notification class="card align-self-center" style="width: auto;margin: 20px;">
                    <div class="card-body">
                        <a class="card-title ">Class Name</a>
                        <hr/>
                        <p class="card-text">notif contnt</p>
                    </div> 
                </notification>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "userDashboard"
    }
</script>

<style scoped lang="css">
.flex-container {
    min-height: 94vh;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    border: 2px solid #5e0d0d;
}
.dashboard-sidebar {
    align-self: stretch;
    width: 25%;
    padding: 30px;
    border-right: 3px solid rgba(136, 133, 133, 0.534);
}
.notification-item {
    flex-grow: 1;
    align-self: stretch;
}

</style>