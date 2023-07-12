<template>
  <div class="w-358.871 h-200 flex-shrink-0 bg-white ml-5 mr-4 mt-8 mb-8">
  <div class="ml-4 mr-4 mb-1 mt-5 flex justify-between items-center ">

    <p class="text-gray-500 text-xs font-prompt font-normal leading-normal mt-3" style="color: #021639; font-size: 12px; font-family: Prompt; font-style: normal; font-weight: 400; line-height: normal;">
  {{ company }}
</p>

      <p class="ml-auto mr-2 text-gray-500 text-xs font-prompt font-normal leading-normal mt-3"> step - 1 </p>
    
      <button> <img src="../../assets/Workforce/TripleDots.svg" alt="Your Image" class="w-5 h-3 flex-shrink-0 mt-3"></button>
    
</div>

<div>
<p class="ml-4 mr-2 text-gray-500 text-xs font-prompt font-normal leading-normal mt-1"> step - 2 </p>
</div>

<div class="mt-3  flex justify-center">
    <p class="ml-4 mr-2 text-gray-500 text-xs font-prompt font-normal leading-normal mt-1">{{name}}</p>
</div>








<div class="flex m-3 mb-1">
    <img src="../../assets/Workforce/Time Circle.png" alt="Your Image" class="w-5 h-5 flex-shrink-0">
    <p class="text-blue-900  ml-2 font-urbanist text-xs font-normal leading-normal" style="color: #0E123E; font-size: 12px; font-style: normal; font-weight: 500; line-height: 130%;">
        {{time}}
    </p>
</div>

<div class="flex">
  <div class="flex m-3">
    <img src="../../assets/Workforce/Location.png" alt="Your Image" class="w-5 h-5 flex-shrink-0">
    <p class="text-blue-900  ml-2 font-urbanist text-xs font-normal leading-normal" style="color: #0E123E; font-size: 12px; font-style: normal; font-weight: 500; line-height: 130%;">
        whileField
    </p>
</div>

<div class="flex m-3 ml-auto">
<img src="../../assets/Workforce/Location.png" alt="Your Image" class="w-7 h-7 flex-shrink-0 mr-1">
<img src="../../assets/Workforce/PhoneIcon.svg" alt="Your Image" class="w-7 h-7 flex-shrink-0">
</div>

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
   name :{
    type : String,
    required : true 
   },
    company: {
      type: String,
      required: true
    }
   
  }
  
}
</script>
<style>

</style>