<template lang="pug">
  div.flex.flex-row.bg-primary.text-white.border.p-4.items-center
    outline-cash-icon.w-6.h-6.mr-4
    h3.text-sm.font-bold.tracking-widest.uppercase {{ title }}
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>