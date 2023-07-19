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
          <LeaveCard v-for="(item, index) in data" :key="index" :leaveData="item.name" :leaveInfo="item.info" />

</div>


</div>



</div>



</template>

<script>
import LeaveCard from '~/components/Workforce/LeaveCard.vue';

export default {
    components:{
        LeaveCard
    },
    data() {
    return {
      data: [
  {
    name: "Sick Leave",
    info: [
      { number: 5, reason: "Vacation" },
      { number: 2, reason: "Sick leave" },
      { number: 1, reason: "Personal reasons" },
      { number: 3, reason: "Other" }
    ]
  },
  {
    name: "Personal Leave",
    info: [
      { number: 3, reason: "Personal reasons" },
      { number: 1, reason: "Family emergency" },
      { number: 2, reason: "Bereavement" },
      { number: 2, reason: "Maternity leave" }
    ]
  },
  {
    name: "Casual Leaves",
    info: [
      { number: 4, reason: "Medical appointment" },
      { number: 1, reason: "Unpaid leave" }
    ]
  },
  {
    name: "Earned Leaves",
    info: [
      { number: 3, reason: "Personal reasons" },
      { number: 1, reason: "Family emergency" },
      { number: 2, reason: "Bereavement" },
      { number: 2, reason: "Maternity leave" }
    ]
  },
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
