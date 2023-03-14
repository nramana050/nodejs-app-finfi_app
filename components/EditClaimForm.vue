<template lang="pug">
ClaimForm(:claimDetails="this.$attrs.claimDetails" :claimAmt="this.$attrs.claimAmt" :totalAmount="this.$attrs.totalTransactionAmount" :selectedTransactionIds="this.$attrs.selectedTransactions" :accountId="this.$attrs.accountId" :accountType="this.$attrs.accountType" :isDiplayTotalAmount="true" :reset="this.$attrs.editReset")
</template>

<script>
export default {
  name: 'EditClaimForm',
  methods: {
    close() {
      this.$FModal.hide()
    },
    confirm() {
      this.$FModal.hide()
    },
  },
}
</script>
<style scoped>
.btn {
  background-color: #7165e3;
}
</style>
