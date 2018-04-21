<template>
    <div id="create_schedule_page">
        <div id="schedule_creator">
            <select class="school_selector">
                <option disabled value="">Select Your Schools!</option>
                <option class="schoolSelectOption" v-for="school in schoolDat.schools" value=school>{{school.name}}</option>    
            </select>
        </div>
        
        <div id="user_schedules">
        </div>
        
        <div id="public_schedules">
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
            }
        },
        props: [
            'schoolDat'
        ],
        components: {
        }
    }
</script>

<style>
    
</style>