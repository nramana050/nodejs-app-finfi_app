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
      p Transactions
</template>

<script>
export default {
  data() {
    return {
      token: this.$auth.strategy.token.get(),
      organization: this.$store.getters.organization,
      isCardEnabled: false,
      financial_partner_type: 'FINFI',
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
      this.financial_partner_type = apiResult.data.financial_partner_type
    }
  },
  methods: {
    navToDashboard() {
      this.$router.push('/workforce/dashboardscreen')
    },
    navToTransfer() {
      if (this.financial_partner_type === 'FINFI') {
        this.$router.push('/transferscreen')
      } else if (this.financial_partner_type === 'NBFC') {
        this.$router.push('/loadbankaccount')
      } else {
        this.$toast.error('Financial partner type not found')
      }
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
