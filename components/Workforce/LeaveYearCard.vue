<template>
  <div class="mt-8 mb-8 rounded-md shadow-lg" style="box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);">
        <div class="ml-5 mt-5">
               <p class="w-101 h-18.618 flex-shrink-0 text-gray-500 font-urbanist font-large text-16 leading-normal ml-5">
            {{monthData.typeOfLeave}}
            </p>

            <div class="m-4 flex justify-between items-center">
    <p class="text-black text-base font-prompt font-normal font-medium leading-normal " style="font-size: 16px; font-family: Prompt; font-style: normal; font-weight: 500; line-height: normal;">
    credited on 
</p>

    <a href="/DailyTask">
      <img class="ml-auto" src="../../assets/Workforce/RightIcon.svg" alt="" />
    </a>
</div>

<p class="w-101 h-18.618 flex-shrink-0 text-gray-500 font-urbanist font-large text-16 leading-normal ml-5">
            {{monthData.validDateFrom}}
</p>

        <div class="flex mr-4">
                <div class="mt-4">
                    <p class="w-101 h-18.618 flex-shrink-0 text-gray-500 font-urbanist font-large text-16 leading-normal ml-5">
            Staus
</p>
<p class="w-101 h-18.618 flex-shrink-0 text-green-500 font-urbanist font-large text-16 leading-normal ml-5">
    Approved
</p>

                </div>
                <div class="ml-auto mt-4">
            <p class="w-101 h-18.618 flex-shrink-0 text-gray-500 font-urbanist font-large text-16 leading-normal ml-5">
            Expiry
</p>
<p class="w-101 h-18.618 flex-shrink-0 text-gray-500 font-urbanist font-large text-16 leading-normal ml-5">
           {{monthData.validDateTo}}
</p>
                </div>

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


};
</script>

<style>
  
</style>