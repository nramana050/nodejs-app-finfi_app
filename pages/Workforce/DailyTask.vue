<template>

<div>
     <!-- First section  -->
<div class="bg-blue-500 h-6"></div>

        <!-- This div for background color   -->
<div style="background: #F5F5F5">

        <!-- Arrow section  -->
        
<div class="flex p-3">
        <button @click="navToDashboard" class="ml-5">
          <FaIcon class="mx-auto" icon="arrow-left" />
        </button>
        
        <p class="ml-4 pt-1"> Task</p>
        
        <img
          class="rounded-full h-8 w-8 ml-auto mr-4"
          
          src="../../assets/headerImage.png"
          alt=""
        />
      </div>


<!-- Today's Date -->

      <div class="flex pt-1 pb-5 mb-5 mt-5 justify-center items-center">
    <a href="/TaskPage">
        <img class="ml-auto mr-5" src="../../assets/leftIcon.svg" alt="" />
    </a>
    
    <p class="ml-2 mr-5 pt-1 text-gray-700 text-xl font-medium text-center">1st March</p>

    <a href="/TaskPage">
        <img class="ml-5" src="../../assets/RightIcon.svg" alt="" />
    </a>
</div> 


<!-- These Are Boxes for tasks -->


<div class="flex">
    <ReusableBox :number="42" :task="'Pending'" color="blue-500" class="ml-8" />
    <ReusableBox :number="30" :task="'Completed'" color="green-500"/>
    <ReusableBox :number="45" :task="'Pending'" color="pink-500"/>
    <ReusableBox :number="14" :task="'Differed'" color="yellow-500"/>
    <ReusableBox :number="15" :task="'Missed'" color="gray-500"/>

  </div>

<!-- These are task assigned for today -->

  <div>
        <ReusableTask v-for="task in tasks" :key="task.time" :time="task.time" :work="task.work" :company="task.company" :nextTask="task.nextTask" />
      </div>
 


</div>

</div>

</template>

<script>

import ReusableBox from '~/components/Workforce_Management/ReusableBox.vue';
import ReusableTask from '~/components/Workforce_Management/ReusableTask.vue';
export default {
  components: {
    ReusableBox,
    ReusableTask
  },

 data() {
    return {
      tasks: [
        {
          time: "9:00 AM",
          work: "Task 1",
          company: "ABC Company",
          nextTask: "Task 2"
        },
        {
          time: "11:00 AM",
          work: "Task 3",
          company: "XYZ Company",
          nextTask: "Task 4"
        },
        {
          time: "2:00 PM",
          work: "Task 5",
          company: "PQR Company",
          nextTask: "Task 6"
        },
        {
          time: "4:00 PM",
          work: "Task 7",
          company: "LMN Company",
          nextTask: "Task 8"
        }
      ]
    };
  },





  methods:{
    navToDashboard() {
      this.$router.push('/dashboard');
    }
  }
}
</script>

<style>

  
</style>