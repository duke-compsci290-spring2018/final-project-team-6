<template>
    <div id="app">
        <div id="start_page_div">
            <h1>Welcome to College ConnecTour!</h1> <br>
            <!--Sign in inputs for users that are already members-->
            <div class="users_input" id="returning_sign_in">
                <h3>Existing User Sign-In:</h3>
                <input id="return_username_input" v-model="returnUsername" placeholder="Username"><br>
                <input id="return_password_input" type="password" v-model="returnPassword" placeholder="Password"><br>
                <button id="sign_in" @click="signIn(returnUsername, returnPassword)">Sign-In!</button>
            </div>
            <!--Sign up inputs for users that want to be members-->
            <div class="users_input" id="new_user_create">
                <h3>New User Sign-Up:</h3>
                <input id="new_username_input" v-model="newUsername" placeholder="New Username"><br>
                <input id="new_password_input" type="password" v-model="newPassword" placeholder="Input Password"><br>
                <input id="confirm_password_input" type="password" v-model="confirmPassword" placeholder="Confirm Password"><br>
                <button id="sign_up" @click="signUp(newUsername, newPassword, confirmPassword)">Sign-Up!</button>
            </div>
            <!--If a user wishes to not be a member, they can continue as guest-->
            <div class="users_input" id="guest_access">
                <h3>Don't want to be a user?</h3>
                <button id="guest_button" @click="guestAccess()">Continue as Guest!</button>
            </div>
        </div>
        <div id="schedCreateContainer" style="display:none">
            <createSchedComp 
                             :schoolDat="schoolDat"
                             :activeUser="activeUser"
                             :usersArray = "users">
                <!--add props inside the ">" 
                    :jsonFileTourData
                    :schoolsSelectorInput
                    :datesSelectorInput
                    :public projects to view-->
            </createSchedComp>
        </div>
        <viewSchedComp>
            <!--add probs inside the ">"
                :Schedule calendar prop
                :map display
                ????-->
        </viewSchedComp>
      
    </div>
</template>

<script>
    //Use bootstrap with vue
    import Vue from 'vue';
    import BootstrapVue from 'bootstrap-vue';
    Vue.use(BootstrapVue);
    import 'bootstrap/dist/css/bootstrap.css';
    import 'bootstrap-vue/dist/bootstrap-vue.css';
    
    //Import components used here
    import createSchedComp from './components/create_schedule_page.vue';
    import viewSchedComp from './components/view_schedule_page.vue';
    
    //Importing json file of school data
    import schoolData from './assets/final_sample.json';
    
export default {
    name: 'app',
    data () {
        return {
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
                    trips:{}
                },
                {
                    username: "guest",
                    password: "",
                    trips:{}
                }
            ], //Array of user objects (username, password, trips)
            
            //JSON file of school data
            schoolDat: schoolData
        }
    },
    components:{
        createSchedComp,
        viewSchedComp
    },
    methods:{
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
            signInScreen.style.display = "none";
            createSchedScreen.style.display = "block";
            return;
        }
        
    }
}
</script>

<style lang="scss">
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
    }

    h1, h2 {
      text-align: center;
    }

    //Align the user input dev boxes and add borders
    .users_input{
        display: block;
        margin: auto;
        width: 33%;
        border: solid;
    }
    
    //Align buttons
    button{
        margin-bottom: 15px;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      display: inline-block;
      margin: 0 10px;
    }

    a {
      color: #42b983;
    }
</style>
