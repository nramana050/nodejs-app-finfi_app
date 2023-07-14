<template>
  <div class="flex justify-center mt-8">
    <div style="width: 298.107px; height: 99.329px; flex-shrink: 0; background-color: #FFFFFF;">
      <div class="m-4 flex justify-between items-center">
        <p class="text-gray-500 text-xs font-prompt font-normal leading-normal">{{ time }}</p>
        <a href="/TaskPage">
          <img class="ml-auto" src="../../assets/Workforce/RightIcon.svg" alt="" />
        </a>
      </div>
      <p class="m-4">{{ companyName }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskCard',
  props: {
    time: {
      type: String,
      required: true
    },
    companyName: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
  
</style>

