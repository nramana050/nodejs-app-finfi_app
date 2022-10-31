<template lang="pug">
div.container.w-96.min-h-screen.mx-auto.font-primary.shadow-2xl.ps-A
  div.flex.flex-col.min-h-screen.justify-between
    div.flex-1
      Nuxt
    div.flex-0.fixed.bottom-0.w-96.rounded
      TabComponent
  tooltip
</template>

<script>
export default {
  name: 'DefaultLayout',

  beforeMount() {
    if (this.$auth.strategy.token.status().unknown()) {
      this.$router.push('/')
    }
  },
}
</script>
<style>
</style>
