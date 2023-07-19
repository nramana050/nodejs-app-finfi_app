<template>
  <div class="mt-8">
        <p class="text-gray-500 font-urbanist text-sm font-normal font-medium leading-normal">
         {{monthData.month}}
        </p>
        <div class="flex ml-5 mt-5">
          <p class="text-gray-500 mr-10 mt-3 font-urbanist text-sm font-normal font-medium leading-normal">
         {{monthData.date}}
        </p>
        <div>
        <p class="text-gray-500 font-urbanist text-sm font-normal font-medium leading-normal">
          {{monthData.holidayName}}
        </p>
        <p class="text-gray-500 font-urbanist text-sm font-normal font-medium leading-normal">
          {{monthData.day}}
        </p>
        </div>
        </div>
  </div>
</template>

<script>
export default {
  name: 'LeaveCard',
props: {
    monthData: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style>
  
</style>