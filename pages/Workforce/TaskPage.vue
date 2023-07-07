<template>
  <div>
    <!-- Heading blue bar  s-->
    <div class="bg-blue-500 h-6"></div>

    <div style="background: #F5F5F5">
    

<!-- Arror section  -->

      <div class="flex p-3">
        <button @click="navToDashboard" class="ml-3">
          <FaIcon class="mx-auto" icon="arrow-left" />
        </button>
        
        <p class="ml-4 pt-1">Task</p>
        
        <img
          class="rounded-full h-8 w-8 ml-auto mr-4"
          
          src="../../assets/headerImage.png"
          alt=""
        />
      </div>

        <!-- today's assigned task -->

      <div class="flex pt-1 pb-5 mb-5 justify-center items-center">
    <a href="/TaskPage">
        <img class="ml-auto mr-5" src="../../assets/leftIcon.svg" alt="" />
    </a>
    
    <p class="ml-2 mr-5 pt-1 text-gray-700 text-xl font-medium text-center">Today</p>

    <a href="/TaskPage">
        <img class="ml-5" src="../../assets/RightIcon.svg" alt="" />
    </a>
</div> 

      
    <!-- Third section boxes  -->
     
      <div class="m-2 mt-5 mb-8 flex">
     <TaskBox :no_of_tasks="42" color="blue-500" class="ml-8" :task="'Missed'" />
<TaskBox :no_of_tasks="30" color="green-500" :task="'Completed'" />
<TaskBox :no_of_tasks="45" color="pink-500" :task="'Pending'" />
<TaskBox :no_of_tasks="14" color="yellow-500" :task="'Inprogres'" />
<TaskBox :no_of_tasks="15" color="gray-500" :task="'Total Task'" />

  
 
</div>

 <!-- Fourth section  Tasks-->

      <div v-for="(task, index) in Tasks" :key="index">
      <TaskCard :time="task.time" :company="task.company" />
    </div>


     
    </div>
  </div>
</template>

<script>
import TaskCard from '~/components/Workforce_Management/TaskCard.vue';
import TaskBox from '~/components/Workforce_Management/TaskBox.vue';
export default {
  components: {
   TaskCard,
   TaskBox
  },
   data() {
    return {
      Tasks: [
        { time: '10:00 AM', company: 'ABC Corporation' },
        { time: '11:30 AM', company: 'XYZ Corporation' },
        { time: '1:15 PM', company: 'Example Corp' },
        { time: '3:45 PM', company: 'Acme Inc.' },
        { time: '5:30 PM', company: 'Global Industries' }
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