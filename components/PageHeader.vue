<template lang="pug">
  div.flex.flex-row.text-white.border.p-4.items-center.ps-1
    button(@click="navToDashboard")
      FaIcon.mx-auto.ps-3(icon='angle-left')
    h3.text-sm.font-bold.tracking-widest {{ title }}
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    navToDashboard() {
      this.$router.push('/Dashboard')
    },
  },
}
</script>
<style scoped>
.ps-3 {
  margin-left: 1rem;
  margin-right: 1rem;
  color: white;
}
.ps-1 {
  background-color: #7165e3;
}
</style>
