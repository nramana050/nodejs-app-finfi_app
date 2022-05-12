<template lang="pug">
  div.container.w-96.min-h-screen.mx-auto.font-primary.shadow-2xl
    div.flex.flex-col.min-h-screen.justify-between
      div.flex-1
        Nuxt
      div.flex-0.fixed.bottom-0.w-96.rounded
        TabComponent
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>