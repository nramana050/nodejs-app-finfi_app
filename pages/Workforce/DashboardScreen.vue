<template>

<div>
<div style="background: #F5F5F5">

  <!-- First section   Heading section -->
<div class="bg-blue-500 h-6" style="width: 100%; height: 104px; flex-shrink: 0;">
<div class="flex p-3">
        
        
       <p style="padding: 0px 206px 14px 0px;">Gamescraft</p>

        
        <img
          class="rounded-full h-8 w-8 ml-auto mr-4"
          
          src="../../assets/Workforce/headerImage.png"
          alt=""
        />
      </div>
</div>

<div>
<p class="mt-4 ml-5 text-gray-800 font-roboto text-base font-medium leading-normal tracking-wide">Hi, Gideon Guernsey</p>

</div>
<div style="border-radius: 14px; background: #E15959; width: 339px; height: 58px; flex-shrink: 0; margin-top: 40px; margin-left: 20px;">
  <div class="flex p-3 pt-4">
        
        
       <p  class="text-white">Clock In</p>

        
        <button class="ml-auto" @click="clockIn"><p class="text-white">Tap here to clock In </p> </button>
      </div>
</div>

    <!-- These are Major sections of wfm like task attendance -->
<div class="flex mt-8 ml-5">

<div>

<div @click="navToAttendance" style="display: flex; flex-direction: column; margin-right: 20px; justify-content: center; align-items: flex-start; gap: 6px; width: 153px; height: 110px; padding: 0px 16px; border-radius: 12px; background: linear-gradient(to bottom right, #8553F3 0%, #A37EF6 50%) bottom right / 50% 50% no-repeat, linear-gradient(to bottom left, #8553F3 0%, #A37EF6 50%) bottom left / 50% 50% no-repeat, linear-gradient(to top left, #8553F3 0%, #A37EF6 50%) top left / 50% 50% no-repeat, linear-gradient(to top right, #8553F3 0%, #A37EF6 50%) top right / 50% 50% no-repeat;">
  
<div  style="border-radius: 24px; background: #FFF; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">
  <img src="../../assets/Workforce/AttendenceIcon.svg" style="display: block;">
</div>
<p class="text-white">Attendance  </p>


</div>
<div style="display: flex; width: 153px; height: 130px; margin-top: 20px; padding: 16px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 26px; border-radius: 12px; background: linear-gradient(to bottom right, #3F8B8D 0%, #58B2B4 50%) bottom right / 50% 50% no-repeat, linear-gradient(to bottom left, #3F8B8D 0%, #58B2B4 50%) bottom left / 50% 50% no-repeat, linear-gradient(to top left, #3F8B8D 0%, #58B2B4 50%) top left / 50% 50% no-repeat, linear-gradient(to top right, #3F8B8D 0%, #58B2B4 50%) top right / 50% 50% no-repeat;">
<div style="border-radius: 24px; background: #FFF; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">
  <img src="../../assets/Workforce/AttendenceIcon.svg" style="display: block;">
</div>
<p class="text-white">Communication </p>
</div>

</div>


<div>

<div  @click="navToDashboard" style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 26px; width: 153px; height: 140px; padding: 16px; border-radius: 12px; background: linear-gradient(to bottom right, #3A9ADE 0%, #5EACE4 50%) bottom right / 50% 50% no-repeat, linear-gradient(to bottom left, #3A9ADE 0%, #5EACE4 50%) bottom left / 50% 50% no-repeat, linear-gradient(to top left, #3A9ADE 0%, #5EACE4 50%) top left / 50% 50% no-repeat, linear-gradient(to top right, #3A9ADE 0%, #5EACE4 50%) top right / 50% 50% no-repeat;">
<div style="border-radius: 24px; background: #FFF; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">
  <img src="../../assets/Workforce/AttendenceIcon.svg" style="display: block;">
</div>
<p class="text-white">Tasks </p>
</div>

<div style="display: flex; width: 153px; height: 100px; margin-top: 20px; padding: 16px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 6px; border-radius: 12px; background: linear-gradient(to bottom right, #DD4A4A 0%, #E87777 50%) bottom right / 50% 50% no-repeat, linear-gradient(to bottom left, #DD4A4A 0%, #E87777 50%) bottom left / 50% 50% no-repeat, linear-gradient(to top left, #DD4A4A 0%, #E87777 50%) top left / 50% 50% no-repeat, linear-gradient(to top right, #DD4A4A 0%, #E87777 50%) top right / 50% 50% no-repeat;">
<div style="border-radius: 24px; background: #FFF; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">
  <img src="../../assets/Workforce/AttendenceIcon.svg" style="display: block;">
</div>
<p class="text-white">Leaves</p>
</div>

</div>

</div>

  <div class="flex p-3 pt-4 mt-5 ml-5 mr-5">
        
        
       <p >Clock In</p>

        <!-- Paggination should be added there to see all the task  -->
        <button class="ml-auto">see all </button> 
  </div>
        <!-- These are all the task  -->

    <div>
        <ScheduleCard v-for="task in tasks" :key="task.time" :time="task.time"  :company="task.company"  :name="task.name"/>
      </div>

  
</div>




</div>
</template>

<script>
import axios from "axios";
import ScheduleCard from '~/components/Workforce/ScheduleCard.vue';


export default {
  components: {
    ScheduleCard,
   
  },
  data() {
    return {
      tasks: [
        {
          time: "9:00 AM - 10:00 AM",
        
          company: "ABC Company",
          name : "Siddarth"
        },
        {
          time: "11:00  - 11: 30 AM",
         
          company: "XYZ Company",
          name : "Yash"
        },
        {
          time: "2:00 PM - 3:00 PM",
         
          company: "PQR Company",
         name : "Tapesh"
        },
        {
          time: "4:00 PM - 5:00 PM",
         
          company: "LMN Company",
          name : "Rahul"
        },
        {
          time: "5:00 PM - 6:00 PM",
         
          company: "LMN Company",
          name : "prasad"
        }
      ]
    };
  },
  methods:{
    navToDashboard(){
      this.$router.push('/Workforce/TaskPage');
      
    },
    navToAttendance() {
      this.$router.push('/Workforce/AttendanceForm');
    },
    clockIn() {

      const data = {
        clockin : true
      }
           axios.post('http://localhost:8003/clock', data)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log("Error occurred:", error);
  });



      this.$router.push('/Workforce/ClockoutPage');
      console.log("Clocking in...");
    },
  }

 
}
</script>

<style>

  
</style>