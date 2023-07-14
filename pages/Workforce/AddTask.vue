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
    <img style="width: 18.601px; height: 20px; flex-shrink: 0;" src="../../assets/Workforce/Company.png" alt="Image" />
  </div>
  
  <div class="flex items-center ml-5">
   
   <input class="text-gray-600 text-sm font-urbanist font-medium leading-normal tracking-wide" type="text" placeholder=" Company Name">
  

  </div>
</div>
<div class="w-288 h-1 bg-gray-300 mx-12 mt-3"></div>
<div class="flex mx-12 mt-4">
  <div class="flex items-center">
    <img style="width: 18.601px; height: 20px; flex-shrink: 0;" src="../../assets/Workforce/Vector.svg" alt="Image" />
  </div>
  
  <div class="flex items-center ml-5">
   <input class="text-gray-600 text-sm font-urbanist font-medium leading-normal tracking-wide" type="text" placeholder="Contact Person">
  </div>
</div>
<div class="w-288 h-1 bg-gray-300 mx-12 mt-3"></div>
<div class="flex mx-12 mt-3">
  <div class="flex items-center">
    <img style="width: 18.601px; height: 20px; flex-shrink: 0;" src="../../assets/Workforce/Group.svg" alt="Image" />
  </div>
  
  <div class="flex items-center ml-5">
   
   <input
  class="text-gray-600 text-sm font-urbanist font-medium leading-normal tracking-wide"
  type="date"
  placeholder="Appointment Date"
>

  </div>
</div>
<div class="w-288 h-1 bg-gray-300 mx-12 mt-3"></div>
<div class="flex mx-12 mt-3">
  <div class="flex items-center">
    <img style="width: 18.601px; height: 20px; flex-shrink: 0;" src="../../assets/Workforce/Location.png" alt="Image" />
  </div>
  
  <div class="flex items-center ml-5">
  <input class="text-gray-600 text-sm font-urbanist font-medium leading-normal tracking-wide" type="text" placeholder=" Location">
  </div>
</div>
<div class="w-288 h-1 bg-gray-300 mx-12 mt-3"></div>
<div class="flex mx-12 mt-3">
  <div class="flex items-center">
    <img style="width: 18.601px; height: 20px; flex-shrink: 0;" src="../../assets/Workforce/Notes.svg" alt="Image" />
  </div>
  
  <div class="flex items-center ml-5">
   <input class="text-gray-600 text-sm font-urbanist font-medium leading-normal tracking-wide" type="text" placeholder="Notes">
  </div>
</div>



<button style="width: 356px; height: 48px; flex-shrink: 0; border-radius: 24px; background: #54A7E2; color: #FFF; text-align: center; line-height: 48px; margin-top: 230px;  margin-left: 5px; margin-right: 5px; margin-bottom: 10px;">Submit</button>












</div>

</div>

</template>

<script>
export default {

  methods:{
    navToDashboard() {
      this.$router.push('/dashboard');
    }
  }
}
</script>

<style>

  
</style>