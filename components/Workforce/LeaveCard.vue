<template>
  <div class="mt-8 bg-white rounded-md">
        <p class="w-101 h-18.618 flex-shrink-0 text-gray-500 font-urbanist font-large text-16 leading-normal ml-5">
    {{leaveData}}
</p>
    <div class="ml-5  mt-5 flex">
         <ul>
      <li v-for="(info, index) in leaveInfo" :key="index" class="text-gray-900">
        {{ info.number }}  &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ info.reason }}
      </li>
    </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeaveCard',
props: {
    leaveData: {
      type: String,
      required: true,
    },
    leaveInfo: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style>
  
</style>