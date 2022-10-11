<template lang="pug">
  div.flex.flex-row.bg-primary.justify-evenly.text-white.shadow-2xl.text-xs.font-bold.tracking-wide.uppercase.py-3
    div.grid.text-center(@click="navToDashboard")
      outline-collection-icon.w-6.h-8.mx-auto
      p Dashboard
    div.grid.text-center(@click="navToCard" v-if="isCardEnabled")
      outline-credit-card-icon.w-6.h-8.mx-auto
      p Cards
    div.grid.text-center(@click="navToTransaction")
      outline-cash-icon.w-6.h-8.mx-auto
      p Transactions
    div.grid.text-center(@click="navToProfile")
      outline-user-circle-icon.w-6.h-8.mx-auto
      p Profile
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
    const apiResult = await this.$axios.get('/organizations/config', {
      headers: {
        Authorization: this.token,
      },
    })
    this.isCardEnabled = apiResult.data.is_card_enabled
  },
  methods: {
    navToDashboard() {
      this.$router.push('/dashboard')
    },
    navToCard() {
      this.$router.push('/cards')
    },
    navToTransaction() {
      this.$router.push('/transactions')
    },
    navToProfile() {
      this.$router.push('/profile')
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
</style>
