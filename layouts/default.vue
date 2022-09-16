<template lang="pug">
div.container.w-96.min-h-screen.mx-auto.font-primary.bg-primary.shadow-2xl
  div.flex.flex-col.min-h-screen.justify-between
    Nuxt.flex-1
    div.logo
      FooterLogo
  tooltip
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>
<style scoped>
  .logo{
    background-color: #7165E3;
    padding-left:31% ;
    padding-top: 20px;
    padding-bottom: 20px;
    border-top-left-radius:15px;
    border-top-right-radius:15px ;
  }
</style>
