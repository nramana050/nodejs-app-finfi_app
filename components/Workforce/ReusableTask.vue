<template>
  <div class="w-358.871 h-110.664 flex-shrink-0 bg-white ml-5 mr-4 mt-8 mb-8">
  <div class="ml-4 mr-4 mb-4 mt-5 flex justify-between items-center ">

    <p class="text-gray-500 text-xs font-prompt font-normal leading-normal mt-3" style="color: #021639; font-size: 12px; font-family: Prompt; font-style: normal; font-weight: 400; line-height: normal;">
  {{ time }}
</p>

      <p class="ml-auto text-gray-500 text-xs font-prompt font-normal leading-normal mt-3"> {{work}} </p>
    
</div>

<div class="m-4 flex justify-between items-center">
    <p class="text-black text-base font-prompt font-normal font-medium leading-normal" style="font-size: 16px; font-family: Prompt; font-style: normal; font-weight: 500; line-height: normal;">
  {{ company }}
</p>

    <a href="/DailyTask">
      <img class="ml-auto" src="../../assets/Workforce/RightIcon.svg" alt="" />
    </a>
</div>

<div class="m-4 flex  items-center">
    <p class="text-gray-500 text-xs font-prompt font-normal leading-normal">Next Step -  </p>
    
      <p class=" text-gray-500 text-xs font-prompt font-normal leading-normal">{{nextTask}}  </p>
    
</div>

  </div>
</template>

<script>
export default {
  name: 'ReusableTask',
  props: {
    time: {
      type: String,
      required: true
    },
    work: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    nextTask: {
      type: String,
      required: true
    }
  }
  
}
</script>
<style>

</style>