<template>
  <div :class="`bg-${color} p-4 rounded-xl w-17 h-16 flex flex-col justify-center items-center mr-4`">
    <div class="flex-grow"></div>
    <!-- <p class="mb-2">{{task}}</p> -->
    <p class="mb-2" style="color: #FFF; text-align: center; font-family: Urbanist; font-size: 8px; font-style: normal; font-weight: 400; line-height: normal; letter-spacing: 0.12px;">
  {{ task }}
</p>

    <p class="text-white text-md">{{ number }}</p>
  </div>
</template>

<script>
export default {
  name: "ReusableBox",
  props: {
    number: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    task: {
      type: String,
      required: true
    }
  }
}
</script>

