<template lang="pug">
  div.flex.flex-row.ps-A.justify-evenly.text-white.shadow-2xl.text-xs.font-bold.tracking-wide.uppercase.py-3
    button.grid.text-center(@click="navToDashboard")
      FaIcon.mx-auto.ps-A1(icon='house')
      p Home
    button.grid.text-center(@click="navToTransfer")
      FaIcon.mx-auto.ps-A1(icon='paper-plane')
      p Transfer
    button.grid.text-center(@click="navToSaveNow")
      FaIcon.mx-auto.ps-A1(icon='tags')
      p Shop
    button.grid.text-center(@click="navToTranscation")
      FaIcon.mx-auto.ps-A1(icon='scroll')
      p History
</template>

<script>
export default {
  data() {
    return {
      token: this.$auth.strategy.token.get(),
      organization: this.$store.getters.organization,
      isCardEnabled: false,
    }
  },
  async beforeMount() {
    if (this.$auth.strategy.token.status().valid()) {
      const apiResult = await this.$axios.get('/organizations/config', {
        headers: {
          Authorization: this.token,
        },
      })
      this.isCardEnabled = apiResult.data.is_card_enabled
    }
  },
  methods: {
    navToDashboard() {
      this.$router.push('/dashboard')
    },
    navToTransfer() {
      this.$router.push('/transferscreen')
    },
    navToSaveNow() {
      this.$router.push('/shopnow')
    },
    navToTranscation() {
      this.$router.push('/transactions')
    },
    // navToSettings() {
    //   this.$router.push('/settings')
    // }
  },
}
</script>

<style scoped>
#tabs {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.ps-A {
  background-color: white;
  color: black;
  height: 3.5rem;
  position: relative;
  z-index: 100;
}
.ps-A1 {
  height: 20px;
}
</style>
