<template>
    <div class="view_schedule_page">
        <div class="header">
            <h1>College ConnecTour</h1>
            <p id="currUser">User: {{currUser}}</p>
        </div>
        <hr>
        <div id="googleMap" style="width:400px;height:400px;"></div>
    </div>
</template>

<script src=”https://maps.googleapis.com/maps/api/js?key=AIzaSyDsLgF5t4x5ugcJm5kIoCFP-q9h8a7Zhdc” >
    //Use bootstrap with vue
    import Vue from 'vue'
    import BootstrapVue from 'bootstrap-vue'
    Vue.use(BootstrapVue);
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    var mapProp= {
        center:new google.maps.LatLng(mySchools[0].location[0],mySchools[0].location[1]),
        zoom:10,
    };
    var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    export default {
        data () {
            return {
            }
        },
        props: [
            'currUser'
        ],
        components: {
        },
        methods: {

        }
    }
</script>

<style>
    
</style>