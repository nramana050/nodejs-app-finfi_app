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
      <a href="" class=" p-3">CLeave Balance</a>
      <a href="" class="  p-3">Holidays</a>
      <a href="" class=" p-3">Camp off</a>
     
      <a href=""></a>
    </div>

<div class="w-370 h-1 bg-gray-300  mt-3"></div>

<div class="m-5">


</div>

        <div class="mt-5 ml-5">
            <p class="text-gray-500 font-prompt text-base font-normal font-medium leading-normal">
                Total {{data.length}} Holidays in the year 
                </p>
        </div>
    <div class="m-5">
        <LeaveMonthCard v-for="(item, index) in data" :key="index" :monthData="item" />

    </div>


</div>



</div>



</template>

<script>

import LeaveMonthCard from '~/components/Workforce/LeaveMonthCard.vue';
export default {
   components:{
        LeaveMonthCard 
    },
    data() {
    return {
      data: [
  {
    month: "January",
    date: "1",
    holidayName: "New Year's Day",
    day: "Friday",
  },
  {
    month: "February",
    date: "14",
    holidayName: "Valentine's Day",
    day: "Monday",
  },
  {
    month: "April",
    date: "22",
    holidayName: "Earth Day",
    day: "Friday",
  },
  {
    month: "December",
    date: "25",
    holidayName: "Christmas Day",
    day: "Sunday",
  },
  {
    month: "March",
    date: "25",
    holidayName: "Holi",
    day: "Saturday",
  },
  {
    month: "April",
    date: "20",
    holidayName: "Good Friday",
    day: "Friday",
  },
]

    };
  },








    methods:{
    navToDashboard() {
      this.$router.push('/workforce/dashboardscreen')
    },
}

}
</script>
