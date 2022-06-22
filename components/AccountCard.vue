<template lang="pug">
div.flex.flex-col.p-4.rounded-md.shadow-md.w-full.bg-gradient-to-tr.from-green-800.to-teal-500.text-white
  div.uppercase.pb-5
    p.tracking-wider.font-bold {{ user.first_name }} {{ user.last_name }}
    p.tracking-wider.text-sm {{ provider.name }}
  div.flex-0.pb-5
    p.tracking-wide.text-xs Available Balance
    p.font-bold.tracking-wider.text-xl &#8377; {{ parseFloat(availableLimit).toFixed(2) }}
  div.flex.justify-between
    div.flex-0
      p.tracking-wide.text-xs Cash Limit
      p.font-bold.tracking-wider.text-sm &#8377; {{ parseFloat(cashLimit).toFixed(2) }}
    div.flex-0.text-right
      p.tracking-wide.text-xs Card Limit
      p.font-bold.tracking-wider.text-sm &#8377; {{ parseFloat(cardLimit).toFixed(2) }}
</template>

<script>
export default {
  props: {
    accounts: {
      type: Array,
      required: true
    },
    provider: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      user: this.$auth.user,
    }
  },
  computed: {
    availableLimit() {
      let balance = 0;
      for (const item of this.accounts) {
        balance += item.account_balance
      }
      return balance;
    },
    cashLimit() {
      const cashAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === 'CASH' );
      return cashAccount[0].account_balance;
    },
    cardLimit() {
      const cardAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === 'CARD' );
      return cardAccount[0].account_balance;
    }
  }
}
</script>