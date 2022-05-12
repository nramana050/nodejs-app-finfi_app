<template lang="pug">
  div.flex.flex-row.bg-primary.justify-around.text-white.shadow-2xl.text-xs.font-bold.tracking-wide.uppercase.py-3
    div.grid.text-center(@click="navToDashboard")
      outline-collection-icon.w-6.h-8.mx-auto
      p Dashboard
    div.grid.text-center(@click="navToTransaction")
      outline-cash-icon.w-6.h-8.mx-auto
      p Transactions
    div.grid.text-center(@click="navToProfile")
      outline-user-circle-icon.w-6.h-8.mx-auto
      p Profile
</template>

<script>
export default {
  methods: {
    navToDashboard() {
      this.$router.push('/dashboard')
    },
    navToTransaction() {
      this.$router.push('/transactions')
    },
    navToProfile() {
      this.$router.push('/profile')
    }
  }
}
</script>

<style scoped>
#tabs {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
</style>