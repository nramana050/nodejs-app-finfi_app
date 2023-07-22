<template>
<div>
   <div :class="`bg-${color} p-4 rounded-xl w-17 h-16 flex flex-col justify-center items-center mr-4`">
    <div class="flex-grow"></div>
    <p class="text-white text-md">{{no_of_tasks}}</p>
  </div>
  <p class="text-center text-xs font-urbanist font-normal font-medium leading-normal tracking-wider mt-4">{{task}}</p>

   </div>

</template>

<script>
export default {
  name: "TaskBox",
  props: {
    
    color: {
      type: String,
      required: true
    },
      no_of_tasks: {
      type: Number,
      required: true
    },
    task: {
      type: String,
      required: true
    }
  }
}
</script>