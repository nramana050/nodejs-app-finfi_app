<template>

<div>
<div style="background: #F5F5F5">

  <!-- First section   Heading section -->
<div class="bg-blue-500 h-6" style="width: 100%; height: 104px; flex-shrink: 0;">
<div class="flex p-3 ">
        
        
       <p style="padding: 0px 206px 14px 0px;" class="mt-5 text-white">Gamescraft</p>

        
        <img
          class="rounded-full h-8 w-8 ml-auto mr-4 mt-5"
          
          src="../../assets/Workforce/headerImage.png"
          alt=""
        />
      </div>
</div>

<div>
<p class="mt-4 ml-5 text-gray-800 font-roboto text-base font-medium leading-normal tracking-wide">Hi, Gideon Guernsey</p>

</div>


<div style="border-radius: 14px; background: #55ADAF; width: 339px; height: 58px; flex-shrink: 0; margin-top: 40px; margin-left: 20px;">
  <div class="flex p-3 pt-4">
    <p class="text-white">Clock Out</p>
    <button class="ml-auto" @click="clockOut"><p class="text-white">Tap here to clock Out</p></button>
  </div>
</div>


    <!-- These are Major sections of wfm like task attendance -->

 

  <div class="flex p-3 pt-4 mt-5 ml-5 mr-5 ">
        
        
       <p >Today's Schedule</p>

        
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
     clockOut() {

      const data = {
        clockin : false
      }
           axios.post('http://localhost:8003/clock', data)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log("Error occurred:", error);
  });



      this.$router.push('/Workforce/DashboardScreen');
      console.log("Clocking out");
    },

  }

 
}
</script>

<style>

  
</style>