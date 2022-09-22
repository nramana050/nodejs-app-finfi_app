<template lang="pug">
div
    p.tracking-(v-if="title") {{ title }}
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
      // required: true
    },
  }
}
</script>