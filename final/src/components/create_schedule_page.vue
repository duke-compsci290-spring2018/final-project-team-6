<template>
    <div id="create_schedule_page">
        <div class="header">
            <h1>College ConnecTour</h1>
            <p id="currUser">User: {{activeUser}}</p>
        </div>
        <hr>
        <div id="schedule_creator">
            <h3>Plan Your Trip!</h3>
            <div class="date_select_div col-12">
                <h4 class="sub1">Select your dates: </h4>
                <p id="date_selectors">
                    Start Date: <input id="start_date" type="date" v-model="startDate" @change="startDateConvert(startDate)"> 
                    End Date: <input id="end_date" type="date" v-model="endDate" @change="endDateConvert(endDate)">
                </p>
            </div>
            <div class="hometown col-12">
                <h4 class="sub1"> Enter Your Starting Zip Code</h4>
                <input class="sub1" id="zip_input" v-model="startZip" placeholder="Zip Code"><br>
            </div>
            <div class="school_select_div col-12">
                <h4 class="sub1">Select your schools: </h4>
                <div class="schoolDropDown">
                    <select multiple class="school_selector_input">
                        <option disabled value="">Select Your Schools!</option>
                        <option class="schoolSelectOption" v-for="school in schoolDat.schools" value=school @click="addSchool(school.name)">
                            {{school.name}}
                        </option>    
                    </select>
                </div>
                <div class="your_schools">
                    <h4 id="your_schools_title">Your Selected Schools:</h4>
                    <p id="your_schools_info" v-for="name in mySchools">
                        <button class="remove_school" @click="remove(name)">&#x2718</button>
                        {{name}}
                    </p>
                </div>
            </div>
            <div class="public_private_div col-12">
                <h4 class="sub1">Make Your Schedule:</h4>
                <div class="radioButtons">
                    <input class="pubRadio" type="radio" name="pubOrPriv" value=0 v-model ="pubAccess"> Public?
                    <br>
                    <input class="pubRadio" type="radio" name="pubOrPriv" value=1 v-model ="pubAccess" selected = true> Private?
                </div>
            </div>
            <br>
            <button class="create_schedules" @click="createSchedule(mySchools, startDate, endDate,startZip)">Create Your Schedules!</button>
        </div>
        <hr>
        
        <div id="user_schedules">
            <h3>View Your Schedules!</h3>
            <hr>
        </div>
        
        <div id="public_schedules">
            <h3>View Others' Schedules!</h3>
        </div>
        <div id="schedViewContainer" style="display:none">
            <div class="header">
                <h1>College ConnecTour</h1>
                <p id="currUser">User: {{activeUser}}</p>
            </div>
            <hr>
        </div>
    </div>
</template>

<script>
    //Use bootstrap with vue
    import Vue from 'vue'
    import BootstrapVue from 'bootstrap-vue'
    Vue.use(BootstrapVue);
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    
    import viewSchedComp from './view_schedule_page.vue';
    
    export default {
        data () {
            return {
                //Temporary data to store user inputs
                startDate: "", //date, want day of week
                endDate: "", //date, want day of week
                startDay: "", //Monday = 0... Sunday = 6
                endDay: "", //Monday = 0... Sunday = 6;
                mySchools: "", //In firebase must initialize to something
                pubAccess: 1, //value 1 = private; value 0 = public (with radio buttons)
                startZip: "",
                schedSchools: "",
                userIndex: -1,
                tripL: 0
                
            }
        },
        props: [
            'schoolDat',
            'activeUser',
            'usersArray'
        ],
        components: {
            viewSchedComp
        },
        methods:{
            /*Turns the start date into an integer (0-6)
            representing day of the week to use in JSON file*/
            //Dont think we need to use this at all anymore
            startDateConvert(sDate){
                console.log(sDate);
                var sd = new Date(sDate);
                console.log(sd);
                this.startDay = sd.getDay();
                console.log(this.startDay);
                return;
            },
            
            /*Turns the end date into an integer (0-6)
            representing day of the week to use in JSON file*/
            //Dont think we need to use this at all anymore either 
            endDateConvert(eDate){
                var ed = new Date(eDate);
                this.endDay = ed.getDay();
                return;
            },
            
            /*Adds selected schools to mySchools array
            to be displayed to user*/
            addSchool(school){
                //If no schools in mySchools array yet, start it
                if(this.mySchools.length == 0){
                    this.mySchools = [school];
                }
                else{
                    //If the school was already selected, don't add it twice
                    if(this.mySchools.indexOf(school) == -1){
                        this.mySchools.push(school);
                    }
                }
            },
            /*When the "x" buttons next to a displayed school
            is clicked, it removes that school from the array
            of mySchools*/
            remove(school){
                var dex = this.mySchools.indexOf(school);
                this.mySchools.splice(dex, 1);
            },
            
            /*Function that creates schedules and moves to next component view 
            when clicked: check for valid input from user*/
            createSchedule(schoolsList, start, end, zip){
                //check that dates have been entered
                if(start == "" || end == ""){
                    alert("Please enter valid start and end dates")
                }
                var sd = new Date(start);
                var ed = new Date(end);
                var thisUser = {};
                var mySchoolsInfo = [];
                var userDex = -1;
                //Find length of trip to make sure you have enough days for schools selected
                this.tripL = this.tripLength(sd, ed);
                
                //check for valid zip code
                if(zip.length != 5){
                    alert("Please enter a valid zip code");
                    this.startZip = "";
                }
                
                //check that user is logged in
                if(this.activeUser == "guest"){
                    alert("Sorry, but only users can create new schedules! Sign up on our home screen to use this function!")
                    return;
                }
                
                //Make sure all required fields are filled out with workable information
                if(sd < new Date() || ed < new Date() || ed < sd){
                    alert("Please select valid dates for your trip");
                    this.startDate = "";
                    this.endDate = "";
                    return;
                }
                
                //Make sure at least 1 school is selected to visit
                if(schoolsList.length < 1){
                    alert("Please select at least 1 school to visit on your trip");
                    return;
                }
                
                //If more schools selected than days in the trip--- don't calculate schedules
                if(this.tripL+1 < schoolsList.length){
                    alert("Sorry! Your trip isn't long enough to visit all those schools!")
                    return;
                }
                
                //Find this user's trips in usersArray to add trips to the user object
                for(var i=0; i<this.usersArray.length; i++){
                    if(this.usersArray[i].username == this.activeUser){
                        //thisUser with .username .password and .trips fields
                        //Track index of this user in userArray so can insert new info directly
                        thisUser = this.usersArray[i];
                        userDex = i;
                        
                        //This is where valid trips are found
                        //Loop through JSON file to find schools in schoolsList
                        for(var j = 0; j<this.schoolDat.schools.length; j++){
                            //console.log("Searching schoolDat");
                            //If the school was in schoolsList (mySchools) array
                            if(schoolsList.indexOf(this.schoolDat.schools[j].name) != -1){
                                //add this school and its information to my local array
                                mySchoolsInfo.push(this.schoolDat.schools[j]);
                            } 
                        }
                        continue; //don't keep looping through array of users because found the one
                    }
                }
                
                //Here, mySchoolsInfo contains school objects of all your selected schools
                this.schedSchools = mySchoolsInfo;
                console.log(this.schedSchools);
                var viewSchedScreen = document.getElementById("schedViewContainer");
                viewSchedScreen.style.display = "block";
                this.userIndex = userDex;
                //Loop through mySchoolsInfo and assign dates and times for all selected schools
                //Add each schedule to thisUser.trips then add thisUser back into this.usersArray at "userDex" index
                var counter = this.startDay;
                var tp = [];
                var tourFound = false;
                for(var q = 0; q < this.tripL+1; q++){
                    tourFound = false;
                    for(var d = 0; d < this.schedSchools.length; d++){
                        if(this.schedSchools[d].tours[counter] == 1 && tourFound == false){
                            tp.push(q);
                            tp.push(counter);
                            tp.push(this.schedSchools[d].tours[counter]);
                            tp.push(this.schedSchools[d].name);
                            tourFound = true;
                        }

                    }
                    if(tourFound == false){
                        tp.push(q);
                        tp.push(counter);
                        tp.push('no school available');
                    }
                    if(counter == 6){
                        counter = 0;
                    }else{
                        counter += 1;
                    }
                }
                console.log(tp);
                
                
                
            },
            
            //Helper function to find number of days between dates selected
            //from https://www.htmlgoodies.com/html5/javascript/calculating-the-difference-between-two-dates-in-javascript.html
            tripLength(date1, date2){
                //1 day in milliseconds
                var day = 1000*60*60*24
                //Convert date1 and date2 to milliseconds too
                var date1_convert = date1.getTime();
                var date2_convert = date2.getTime();
                var diff = date2_convert - date1_convert;
                return Math.round(diff/day);
            }
        }
    }
</script>

<style lang = "scss">
    //Align titles center
    h3{
        display: block;
        text-align: center;
    } 
    //Align sub-headings to the left
    .sub1{
        display: block;
        text-align: left;
        text-decoration: underline;
    }
    .header{
        padding: 30px;
    }
    //Align div containing all date selector info
    .date_select_div{
        display: block;
        padding-bottom: 20px;
    }
    
    //Align date selectors indented under their heading
    #date_selectors{
        display: block;
        text-align: left;
        padding-left: 5%;
    }
   
    //Align school selector div
    .schoolDropDown{
        display: block;
        padding-left: 5%;
    }
    //Align selcted schools div
    .your_schools{
        display: block;
        margin-top: -115px;
    }
    //Align schools selected display
    #your_schools_title{
        display: block;
        text-decoration: underline;
    }
    
    #your_schools_info{
        display: block;
    }
    
    //Display the current user
    #currUser{
        display: block;
        text-align: right;
        //margin-top: -70px;
        //margin-left: 400px;
    }
    
    //Align select input to the left
    select{
        display: block;
        margin-left: 0px;
        //margin-bottom: 100px;
    }
    
    .public_private_div{
        display: block;
        margin-top: 100px;
    }
    
    //Align public vs. private div box
    .radioButtons{
        display: block;
        //margin-top: -40px;
        margin-left: -400px;
    }
    
    
</style>