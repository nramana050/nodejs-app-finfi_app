<template>

 <!-- This div for complete page  -->
<div>
  <!-- Header Section  -->
<div class="bg-blue-500 h-6"></div>


         <!-- This div for background color   -->
<div style="background: #F5F5F5">

    <!-- Arrow section  -->
        
<div class="flex p-3">
        <button @click="navToDashboard" class="ml-5">
          <FaIcon class="mx-auto" icon="arrow-left" />
        </button>
        
        <p class="ml-4 pt-1"> Add Tasks</p>
        
        <img
          class="rounded-full h-8 w-8 ml-auto mr-4"
          
          src="../../assets/Workforce/headerImage.png"
          alt=""
        />
      </div>

   

   <!-- Search Bar -->

<div style="border-radius: 12px; border: 1px solid #E6E8E6; background: #FFF; width: 330px;  height: 48px; flex-shrink: 0; margin: 30px;" class="flex">
  <div class="flex items-center ml-2">
    <img style="width: 18.601px; height: 20px; flex-shrink: 0;" src="../../assets/Workforce/search.svg" alt="Image" />
  </div>
  
  <div class="flex items-center ml-2">
    <input class="w-155 flex-shrink-0 text-sm font-urbanist font-normal leading-normal tracking-wide" type="text" v-model="inputValue" placeholder="Search Company" />
  </div>
</div>

    
<div class="mt-12 ml-5">
<p class="text-black text-base font-urbanist font-normal leading-normal tracking-wider">Add a task</p>


<!-- these are tasks  -->

</div>
<div class="w-288 h-1 bg-gray-300 mx-12 mt-5"></div>

<div class="flex mx-12 mt-3">
  <div class="flex items-center">
    <img style="width: 25.601px; height: 30px; flex-shrink: 0;" src="../../assets/Workforce/Company.png" alt="Image" />
  </div>
  
  <div class="flex items-center ml-5">
   
  <input
  type="text"
  v-model="leadID"
  placeholder="Select Lead"
  class="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:outline-blue-500 hover:border-blue-500"
/>
  

  </div>
</div>
<div class="w-288 h-1 bg-gray-300 mx-12 mt-3"></div>
<div class="flex mx-12 mt-4">
  <div class="flex items-center">
    <img style="width: 25.601px; height: 30px; flex-shrink: 0;" src="../../assets/Workforce/Vector.svg" alt="Image" />
  </div>
  
  <div class="flex items-center ml-5">
   <input class="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:outline-blue-500 hover:border-blue-500" type="text" v-model="meetingWith" placeholder="Contact Person">
  </div>
</div>
<div class="w-288 h-1 bg-gray-300 mx-12 mt-3"></div>
<div class="flex mx-12 mt-3">
  <div class="flex items-center">
    <img style="width: 25.601px; height: 30px; flex-shrink: 0;" src="../../assets/Workforce/Group.svg" alt="Image" />
  </div>
  
  <div class="flex items-center ml-5">
   
   <input
  class="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:outline-blue-500 hover:border-blue-500"
  type="date"
  v-model="appointmentDate"
  placeholder="Appointment Date"
>

  </div>
</div>
<div class="w-288 h-1 bg-gray-300 mx-12 mt-3"></div>
<div class="flex mx-12 mt-3">
  <div class="flex items-center">
    <img style="width: 16.601px; height: 20px; flex-shrink: 0;" src="../../assets/Workforce/Group.svg" alt="Image" />
  </div>
  
  <div class="flex items-center ml-5">
   
   <input
  type="time"
  v-model="timefrom"
  class="w-25 px-3 py-2 mr-5 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
  placeholder="From Time"
/>

<input
  type="time"
  v-model="timeTo"
  class="w-25 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
  placeholder="To Time"
/>

  </div>
</div>
<div class="w-288 h-1 bg-gray-300 mx-12 mt-3"></div>
<div class="flex mx-12 mt-3">
  <div class="flex items-center">
    <img style="width: 25.601px; height: 30px; flex-shrink: 0;" src="../../assets/Workforce/Location.png" alt="Image" />
  </div>
  
  <div class="flex items-center ml-5">
  <input class="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:outline-blue-500 hover:border-blue-500" type="text"  v-model="meetingLocation" placeholder=" Location">
  </div>
</div>
<div class="w-288 h-1 bg-gray-300 mx-12 mt-3"></div>
<div class="flex mx-12 mt-3">
  <div class="flex items-center">
    <img style="width: 25.601px; height: 30px; flex-shrink: 0;" src="../../assets/Workforce/Notes.svg" alt="Image" />
  </div>
  
  <div class="flex items-center ml-5">
   <input class="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:outline-blue-500 hover:border-blue-500" type="text" v-model="meetingNotes" placeholder="Notes">
  </div>
</div>



<button style="width: 356px; height: 48px; flex-shrink: 0; border-radius: 24px; background: #54A7E2; color: #FFF; text-align: center; line-height: 48px; margin-top: 240px;  margin-left: 5px; margin-right: 5px; margin-bottom: 10px;" @click="handleSubmit">Submit</button>







<!-- <div>
<input
  type="time"
  v-model="selectedTime"
  class="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
/>

</div> -->




</div>

</div>

</template>

<script>
import axios from 'axios';
export default {
    data() {
    return {
       leadID: '', 
      meetingWith: '',
      appointmentDate: '',
      timefrom: '',
      timeTo: '',
      meetingLocation: '',
      meetingNotes: '',
    };
  },

  methods:{
    navToDashboard() {
      this.$router.push('/dashboard');
    },
     handleSubmit() {
      
      const data = {
        leadID: this.leadID,
        meetingWith: this.meetingWith,

        appointmentDate: this.appointmentDate,
        timefrom: this.timefrom,
        timeTo: this.timeTo,
        meetingLocation: this.meetingLocation,
        meetingNotes: this.meetingNotes,
        
      };
      debugger;
      this.$axios.post('/tasks', data) // Vikas: trial
      
      // axios.post(this.$getWFMUrlBase() + '/tasks', data)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log("Error occurred:", error);
  });
     this.$router.push('/Workforce/TaskPage');

    }
  }
}
</script>

<style>

  
</style>