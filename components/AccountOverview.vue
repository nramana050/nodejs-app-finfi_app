<template lang="pug">
  div.flex.flex-col.items-center.w-full
    div.border.rounded-xl.bg-primary.text-white.w-full.p-4(v-if="account")
      p Account Number
      h2.text-2xl.font-bold.tracking-wide {{ account.account_number }}
      p.pt-8 Balance
      h5.text-2xl.font-bold.tracking-wide ₹ {{ account.account_balance }}

    div
      h5.text-xl.underline Transactions
      p {{ transactions }}
</template>

<script>
export default {
  data() {
    return {
      account: null,
      transactions: []
    }
  },
  computed: {
    token() {
      return this.$storage.getLocalStorage('token')
    }
  },
  async beforeMount() {
    const result = await this.$axios.$get('/accounts', {
      headers: {
        'Authorization': this.token
      }
    });
    this.account = result;
    const transactions = await this.$axios.$get('/accounts/transactions', {
      headers: {
        'Authorization': this.token
      }
    });
    this.transactions = transactions;
  }
}
</script>