<template>
    <div id="app">
        <div class="start_page_div">
            <h1>Welcome to College ConnecTour!</h1>
            <!--Sign in inputs for users that are already members-->
            <div class="users_input" id="returning_sign_in">
                <h3>Existing User Sign-In:</h3>
                <input id="return_username_input" v-model="returnUsername" placeholder="Username"><br>
                <input id="return_password_input" v-model="returnPassword" placeholder="Password"><br>
                <button id="sign_in" @click="signIn(returnUsername, returnPassword)">Sign-In!</button>
            </div>
            <!--Sign up inputs for users that want to be members-->
            <div class="users_input" id="new_user_create">
                <h3>New User Sign-Up:</h3>
                <input id="new_username_input" v-model="newUsername" placeholder="New Username"><br>
                <input id="new_password_input" v-model="newPassword" placeholder="Input Password"><br>
                <input id="confirm_password_input" v-model="confirmPassword" placeholder="Confirm Password"><br>
                <button id="sign_up" @click="signUp(newUsername, newPassword, confirmPassword)">Sign-Up!</button>
            </div>
            <!--If a user wishes to not be a member, they can continue as guest-->
            <div class="users_input" id="guest_access">
                <h3>Don't want to be a user?</h3>
                <button id="guest_button">Continue as Guest!</button>
            </div>
        </div>
        <createSchedComp
                         :schoolDat="schoolDat">
            <!--add props inside the ">" 
                :jsonFileTourData
                :schoolsSelectorInput
                :datesSelectorInput
                :public projects to view-->
        </createSchedComp>
        <viewSchedComp>
            <!--add probs inside the ">"
                :Schedule calendar prop
                :map display
                ????-->
        </viewSchedComp>
      
    </div>
</template>

<script>
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
            
            //JSON file of school data
            schoolDat: schoolData
        }
    },
    components:{
        createSchedComp,
        viewSchedComp
    },
    methods:{
        signIn(un,pw){
            return;
        },
        signUp(un, pw, pwConf){
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
