<template lang="pug">
div.flex.flex-col.p-4.rounded-md.shadow-md.w-full.bg-gradient-to-tr.from-green-800.to-teal-500.text-white
  div.uppercase.pb-5
    p.tracking-wider.font-bold {{ user.first_name }} {{ user.last_name }}
    p.tracking-wider.text-sm {{ provider.name }}
  div.flex.justify-between.pb-5
    div.flex-0
      p.tracking-wide.text-xs Available Balance
      p.font-bold.tracking-wider.text-xl &#8377; {{ parseFloat(availableLimit).toFixed(2) }}
    div.flex-0.text-right
      p.tracking-wide.text-xs
        | Salary Used
        sup.pl-1 *
      p.font-bold.tracking-wider.text-xl &#8377; {{ parseFloat(payableAmount).toFixed(2) }}
  div.flex.justify-between
    div.flex-0
      p.tracking-wide.text-xs Cash Limit
      p.font-bold.tracking-wider.text-sm &#8377; {{ parseFloat(cashLimit).toFixed(2) }}
    div.flex-0.text-right
      p.tracking-wide.text-xs Card Limit
      p.font-bold.tracking-wider.text-sm &#8377; {{ parseFloat(cardLimit).toFixed(2) }}
  div.flex.pt-4
    p.text-xs
      sup.pr-1 *
      | Employer will deduct from the next salary
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
    payableAmount() {
      const payableAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === 'PAYABLE' );
      return payableAccount[0].account_balance;
    },
    cashLimit() {
      const cashAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === 'CASH' );
      return cashAccount[0].account_balance;
    },
    cardLimit() {
      const cardAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === 'CARD' );
      return cardAccount[0].account_balance;
    },
    availableLimit() {
      return Number(this.cashLimit) + Number(this.cardLimit)
    },
  }
}
</script>