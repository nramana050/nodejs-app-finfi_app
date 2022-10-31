<template lang="pug">
    div
      div.text-5xl.font-bold.ps-10 Finfi 
      div.text-sm.ps-3 Salary simplified
      nuxt-img.rounded-xl.ps-4(preload src="/finfi.png" width="140" height="140")
</template>
<script>
export default {
  name: 'SpalshScreen',
  layout: 'empty',
  data() {
    return {
      isLoading: true,
    }
  },
  mounted() {
    setTimeout(() => {
      this.$emit('splash', this.isLoading)
    }, 3000)
  },
}
</script>
<style scoped>
.ps-10 {
  color: white;
  padding-top: 8rem;
  letter-spacing: 1px;
}
.ps-3 {
  color: white;
  padding-top: 10px;
}
.ps-4 {
  margin-left: 32%;
  padding-top: 2rem;
}
</style>
