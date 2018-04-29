var schoolJSON = {
    "schools":[
        
        {
            "name": "Duke",
            "tours":[1,1,1,1,1,1,1],
            "location": [ 36.00, -78.93 ]
        },
        {
            "name": "Harvard",
            "tours":[1,1,1,1,1,1,1],
            "location": [ 42.37, -71.11 ]
        },
        {
            "name": "Yale",
            "tours":[1,1,1,1,1,1,1],
            "location": [ 41.32, -72.92 ]
        },
        {
            "name": "Princeton",
            "tours":[1,1,1,1,1,1,1],
            "location": [ 40.34, -74.65 ]
        },
        {
            "name": "Brown",
            "tours":[1,1,1,1,1,1,1],
            "location": [ 41.83, -71.40 ]
        },
        {
            "name": "MIT",
            "tours":[1,1,1,1,1,1,1],
            "location": [ 42.36, -71.09 ]
        },
        {
            "name": "UPenn",
            "tours":[1,1,1,1,1,1,1],
            "location": [ 39.95, -75.19 ]
        },
        {
            "name": "Dartmouth",
            "tours":[1,1,1,1,1,1,1],
            "location": [ 43.70, -72.29 ]
        },
        {
            "name": "Williams",
            "tours":[1,1,1,1,1,1,1],
            "location": [ 42.71, -73.20 ]
        },
        {
            "name": "Columbia",
            "tours":[1,1,1,1,1,1,1],
            "location": [ 40.81, -73.96 ]
        }
    ]
};

var app = new Vue({
    data: {
        //Temporary data objects referenced with v-models in html
        returnUsername: "",
        returnPassword: "",
        newUsername: "",
        newPassword: "",
        confirmPassword: "",
        activeUser: "",
        users: [
            {
                username: "admin",
                password: "AdminPassword",
                trips:[]
            },
            {
                username: "guest",
                password: "",
                trips:[]
            }
        ], //Array of user objects (username, password, trips)
        //JSON file of school data
        schoolDat: schoolJSON,
        //Temporary data to store user inputs
        startDate: "", //date, want day of week
        endDate: "", //date, want day of week
        startDay: "", //Monday = 0... Sunday = 6
        endDay: "", //Monday = 0... Sunday = 6;
        mySchools: "", //In firebase must initialize to something
        pubAccess: 1, //value 1 = private; value 0 = public (with radio buttons)
        startZip: "",
        schedSchools: "", //same as mySchools?
        userIndex: -1, //To find user in users to add trips to this user
        tripL: 0
    },

    methods: {
        signIn(userName, userPassword){
            var i = 0;
            var signInScreen = document.getElementById("start_page_div");
            var createSchedScreen = document.getElementById("schedCreateContainer");
            
            //Ensure that all data has been filled out
            if(userName == "" || userPassword == ""){
                alert("Please enter all required information");
                //reset information
                this.returnUsername = "";
                this.returnPassword = "";
                return;
            }
            
            //Loop through users array and check if valid username, password combo
            for(i=0; i<this.users.length; i++){
                //un already lowercase in array (added as .toLowerCase() in sign up method)
                var un = this.users[i].username;
                var pw =this.users[i].password;
                //Username in users, check password
                if(un == userName.toLowerCase()){
                    if(pw == userPassword){
                        //set active user to userName to use later components
                        this.activeUser = un;
                        alert("Welcome back " + userName + "!");
                        //Hide the sign in screen and take user to create schedule screen
                        //signInScreen.style.display = "none";
                        createSchedScreen.style.display = "block";
                        this.returnUsername = "";
                        this.returnPassword = "";
                        return;
                    }
                }
            }
            
            //If username and password wasn't found in users array
            alert("Your username and/or password were not found")
            
            //Reset sign-in info
            this.returnUsername = "";
            this.returnPassword = "";
            return;
        },
        signUp(userName, userPassword, pwConf){
            var i = 0;
            var signInScreen = document.getElementById("start_page_div");
            var createSchedScreen = document.getElementById("schedCreateContainer");
            
            
            //Check if username already in database
            for(i=0; i<this.users.length; i++){
                var un = this.users[i].username;
                if(un == userName.toLowerCase()){
                    alert("Sorry, that username is already taken.  Please select a different username.");
                    this.newUsername = "";
                    this.newPassword = "";
                    this.confirmPassword ="";
                    return;
                }
            }
            
            //Make sure password and password confirmation match
            if(userPassword != pwConf){
                alert("Please make sure your password confirmation matches.");
                this.newPassword = "";
                this.confirmPassword = "";
                return;
            }
            
            //Make sure password is at least length 6
            if(userPassword.length < 6){
                alert("Please make sure your password contains at least 6 charcaters.");
                this.newPassword = "";
                this.confirmPassword = "";
                return;
            }
            
            //If got here, username is available and passwords matches criteria
            //Add to users dataset
            this.users.push({
                username: userName.toLowerCase(),
                password: userPassword,
                trips: {}
            })
            console.log(this.users)
            
            //Show desired screens
            //signInScreen.style.display = "none";
            createSchedScreen.style.display = "block";
            
            //Set active user to userName to be used in later components
            this.activeUser = userName.toLowerCase();
            this.newUsername = "";
            this.newPassword = "";
            this.confirmPassword = "";
            return;
        },
        guestAccess(){
            var signInScreen = document.getElementById("start_page_div");
            var createSchedScreen = document.getElementById("schedCreateContainer");
            this.activeUser = "guest";
            //signInScreen.style.display = "none";
            createSchedScreen.style.display = "block";
            return;
        },  
        /*Turns the start date into an integer (0-6)
        representing day of the week to use in JSON file*/
        //Dont think we need to use this at all anymore
        startDateConvert(sDate){
            console.log(sDate);
            var sd = new Date(sDate);
            //console.log(sd);
            this.startDay = sd.getDay();
            //console.log(this.startDay);
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

            //Find this user's trips in users to add trips to the user object
            for(var i=0; i<this.users.length; i++){
                if(this.users[i].username == this.activeUser){
                    //thisUser with .username .password and .trips fields
                    //Track index of this user in userArray so can insert new info directly
                    thisUser = this.users[i];
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

            //Here, schedSchools and mySchoolsInfo contains school objects of all your selected schools
            this.schedSchools = mySchoolsInfo;
            //console.log(this.schedSchools);

            var viewSchedScreen = document.getElementById("schedViewContainer");
            viewSchedScreen.style.display = "block";
            this.userIndex = userDex;

            //Loop through mySchoolsInfo and assign dates and times for all selected schools
            //Add each schedule to thisUser.trips then add thisUser back into this.users at "userDex" index
            var counter = this.startDay;
            var fact = this.factorial(this.tripL+1 - this.schedSchools.length);//Factorial to multiply length by for permutations
            //console.log("trip length: ", this.tripL + 1);
            //console.log("schedSchools length: ", this.schedSchools.length);
            //console.log("factorial calc: ", fact);
            if(this.schedSchools.length == 1){
                var permutations = this.tripL + 1
            }
            if(this.schedSchools.length > 1){
                var permutations = this.factorial((this.tripL+1))/(fact);  
            } 
            console.log("permutations", permutations);

            //Array of trips length of trip 
            //Add individual tps into allTrips array
            var allTrips = new Array(permutations);
            for(var i = 0; i < allTrips.length; i++){
                var trip = new Array(this.tripL + 1);
                for(var j = 0; j < trip.length; j++){
                    trip[j] = "No Tour";
                }
                allTrips[i] = trip;
            }
            //console.log(permutations);
            //console.log(allTrips.length);
            //var tp = new Array(this.tripL+1);
            var count = 0; 
            for(var s = 0; s<this.schedSchools.length; s++){
                var count = 0;
                var timeThrough = 0;
                var sch = this.schedSchools[s];
                var dex = s-1
                for(var q = 0; q<permutations; q++){//loop through each possible trip
                    dex += 1;
                    if(dex >= (this.tripL + 1)){
                        if(count >= this.tripL + 1){
                            if(count % (this.tripL + 1) == 0){
                                timeThrough += 1;
                            }
                        dex = dex + (s*timeThrough);
                        }
                        //console.log("dex = ", dex);
                        //console.log("length = ", (this.tripL + 1));
                        dex = dex % (this.tripL + 1);
                        //dex = (this.tripL)%(dex - (this.tripL + 1));
                        //console.log("new dex = ", dex);
                    }
                    allTrips[q][dex] = sch.name;
                    count += 1;
                }

                //console.log(allTrips);
            }
            console.log("AllTrips Array: ", allTrips);
            /*
            for(var q = 0; q < allTrips.length; q++){ //loop over all permutations of schedules
                var tp = new Array(this.tripL + 1); //each index represents day of the trip to visit a school
                for(var s = 0; s<this.schedSchools.length; s++){ //loop over all the schools that user wants to visit
                    var sch = this.schedSchools[s];
                    for(var d = 0; d<tp.length; d++){//add sch to diff days on the trip
                        allTrips[q][d] = sch; //set the school to day d in tp q in allTrips
                    }
                }

            }*/

            /*
            var tourFound = false;
            //q = day of the trip that you're on 
            for(var q = 0; q < this.tripL+1; q++){
                tourFound = false;
                //Loop through each school that user wants to visit 
                for(var d = 0; d < this.schedSchools.length; d++){
                    //If the school in question has a tour on this day of the trip
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
            }*/
            //console.log(tp);



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
        },

        //Helper function to calculate number of permutations of schedules to make 
        factorial(number){
            var res = number;
            if(number == 0 || number == 1){
                return 1;
            }
            while(number > 1){
                number = number -1;
                res = res*number;
            }
            return res;
        }
    }  
});

// mount
app.$mount('#finalapp');
