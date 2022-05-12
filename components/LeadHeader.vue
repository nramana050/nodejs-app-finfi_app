<template lang="pug">
  div.flex.flex-col.text-white
    p.font-bold.text-2xl.pb-4.tracking-wide(v-if="title") {{ title }}
    p.text-md {{ lead }}
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
      required: false
    },
    lead: {
      type: String,
      required: true
    },
  }
}
</script>