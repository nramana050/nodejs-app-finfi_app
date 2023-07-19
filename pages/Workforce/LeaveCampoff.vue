<template>

<div>
  <!-- Header Section  -->
<div class="bg-blue-500 h-6">
</div>


<div style="background: #F5F5F5">

<div class="flex p-3">
        <button @click="navToDashboard" class="ml-5">
          <FaIcon class="mx-auto" icon="arrow-left" />
        </button>
        
        <p class="ml-4 pt-1">Leave</p>
        
        <img
          class="rounded-full h-8 w-8 ml-auto mr-4"
          
          src="../../assets/Workforce/headerImage.png"
          alt=""
        />
      </div>

     <div class="flex justify-around mb-5 mt-5">
      <!-- Task Nav -->
      <a href="" class=" p-3">Leave Balance</a>
      <a href="" class="  p-3">Holidays</a>
      <a href="" class=" p-3">Camp off</a>
     
      <a href=""></a>
    </div>

<div class="w-370 h-1 bg-gray-300  mt-3"></div>

   <div class="mt-8 bg-white  flex ml-5 rounded-md" style="width: 350px; height: 106px;">
       <p
      class="text-base font-medium m-5"
      style="
        color: #282837;
        font-family: 'Urbanist';
        font-size: 26px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      "
    >
     Balance
    </p>
    <p
      class="text-base font-medium m-5   "
      style="
        color: #282837;
        font-family: 'Urbanist';
        font-size: 26px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      "
    >
    {{leaveEntries.length}}
    </p>
     
    </div>

      <div class="m-4">

    <LeaveCard v-for="(item, index) in leaveEntries" :key="index" :monthData="item" />

      </div>

</div>



</div>



</template>

<script>
import LeaveCard from '~/components/Workforce/LeaveYearCard.vue';

export default {
    components:{
        LeaveCard
    },
    data() {
    return {
      leaveEntries: [
  {
    typeOfLeave: "Sick Leave",
    validDateFrom: "30 April 2023",
    validDateTo: "2 May 2023"
  },
  {
    typeOfLeave: "Annual Leave",
    validDateFrom: "15 June 2023",
    validDateTo: "20 June 2023"
  },
  {
    typeOfLeave: "Maternity Leave",
    validDateFrom: "1 August 2023",
    validDateTo: "31 October 2023"
  }
]

    };
  },


    
    methods:{
    navToDashboard() {
      this.$router.push('/dashboard')
    },
}

}
</script>