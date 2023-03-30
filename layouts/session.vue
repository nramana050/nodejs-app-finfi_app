<template lang="pug">
div.container.w-96.min-h-screen.mx-auto.font-primary.shadow-2xl.ps-A
  div.flex.flex-col.min-h-screen.justify-between
    div.flex-1.main-layout-container
      Nuxt
    div.flex-0.fixed.bottom-0.w-96.rounded
      TabComponent
  tooltip
</template>

<script>
export default {
  name: 'DefaultLayout',

  beforeMount() {
    if (
      this.$auth.strategy.token.status().unknown() ||
      !this.$auth.strategy.token.status().valid()
    ) {
      this.$router.push('/')
    }
  },
}
</script>
<style>
.main-layout-container {
  padding-bottom: 50px;
}
</style>
