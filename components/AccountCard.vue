<template lang="pug">
div.ps-1
  //- div.uppercase.pb-5
  //-   p.tracking-wider.font-bold {{ user.first_name }} {{ user.last_name }}
  //-   p.tracking-wider.text-sm {{ provider.name }}
  //- div.flex.justify-between.pb-5
  //-   div.flex-0
  //-     p.tracking-wide.text-xs Available Balance
  //-     p.font-bold.tracking-wider.text-xl &#8377; {{ parseFloat(availableLimit).toFixed(2) }}
  div.flex.justify-between
    div.flex-0.text-left
      div.tracking-wide.text-xs
        | Salary Used
        sup.pl-1 *
      p.ps-3.tracking-wider.text-sm &#8377; {{ parseFloat(payableAmount).toLocaleString('en-IN') }}
  
    div.flex-0(v-if="earnedLimit!==null")
      div.flex.tracking-wide.text-xs
        p.flex-1 Limit
        div.text-xs.ps-6(v-if="cashFundCycle.length > 0" v-popover:tooltip="`You are eligible for a limit of Rs: ${this.cashFundCycle[0].credit_value} per day between ${this.cashFundCycle[0].credit_start_day} and ${this.cashFundCycle[0].credit_end_day} of the month`")
          solid-information-circle-icon.w-4.h-4 
      p.ps-3.tracking-wider.text-sm &#8377; {{ parseFloat(earnedLimit).toLocaleString('en-IN') }}
    div.flex-0(v-if="cashLimit!==null")
      div.flex.tracking-wide.text-xs
        p.flex-1 Cash Limit
        div.text-xs.ps-6(v-if="cashFundCycle.length > 0" v-popover:tooltip="`You are eligible for a limit of Rs: ${this.cashFundCycle[0].credit_value} per day between ${this.cashFundCycle[0].credit_start_day} and ${this.cashFundCycle[0].credit_end_day} of the month`")
          solid-information-circle-icon.w-4.h-4
      p.ps-3.tracking-wider.text-sm &#8377; {{ parseFloat(cashLimit).toLocaleString('en-IN') }}
    div.flex-0.text-right(v-if="cardLimit!==null")
      div.flex.tracking-wide.text-xs
        p.flex-1 Card Limit
        div.flex-0(v-if="cardFundCycle.length > 0" v-popover:tooltip="`You are eligible for a limit of Rs: ${this.cardFundCycle[0].credit_value} per day between ${this.cardFundCycle[0].credit_start_day} and ${this.cardFundCycle[0].credit_end_day} of the month`")
          solid-information-circle-icon.w-4.h-4
      p.ps-3.tracking-wider.text-sm &#8377; {{ parseFloat(cardLimit).toLocaleString('en-IN') }}
  div.ps-4      
  div
    p.text-xs.ps-5
      sup.pr-1 *
      | Employer will deduct from the next salary
</template>

<script>
export default {
  props: {
    accounts: {
      type: Array,
      required: true,
    },
    provider: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      user: this.$auth.user,
      cardFundCycle: [],
      cashFundCycle: [],
    }
  },
  computed: {
    payableAmount() {
      const payableAccount = this.accounts.filter(
        (item) => item.account_type.toUpperCase() === 'PAYABLE'
      )
      return payableAccount[0].account_balance
    },
    cashLimit() {
      const cashAccount = this.accounts.filter(
        (item) => item.account_type.toUpperCase() === 'CASH'
      )
      return cashAccount.length > 0 ? cashAccount[0].account_balance : null
    },
    cardLimit() {
      const cardAccount = this.accounts.filter(
        (item) => item.account_type.toUpperCase() === 'CARD'
      )
      return cardAccount.length > 0 ? cardAccount[0].account_balance : null
    },
    earnedLimit() {
      const earnedAccount = this.accounts.filter(
        (item) => item.account_type.toUpperCase() === 'EARNED_WAGES'
      )
      return earnedAccount.length > 0 ? earnedAccount[0].account_balance : null
    },
    // availableLimit() {
    //   return Number(0) + Number(0)
    // }
  },
  mounted() {
    this.fetchFundCycle()
  },
  methods: {
    async fetchFundCycle() {
      const response = await this.$axios.get(`/fundConfig/message`)
      const fundCycle =
        response.data.message.toUpperCase() === 'SUCCESS' ? true : null
      if (fundCycle) {
        this.cardFundCycle = response.data.data.filter(
          (x) => x.account_type.toUpperCase() === 'CARD'
        )
        if (this.cardFundCycle.length > 0) {
          if (
            this.cardFundCycle[0].credit_method.toUpperCase() === 'PERCENTAGE'
          ) {
            this.cardFundCycle[0].credit_value =
              parseFloat(this.cardFundCycle[0].salary).toFixed(2) *
              (parseFloat(this.cardFundCycle[0].credit_value).toFixed(2) / 100)
          }
        }
        this.cashFundCycle = response.data.data.filter(
          (x) => x.account_type.toUpperCase() === 'CASH'
        )
        if (this.cashFundCycle.length > 0) {
          if (
            this.cashFundCycle[0].credit_method.toUpperCase() === 'PERCENTAGE'
          ) {
            this.cashFundCycle[0].credit_value =
              parseFloat(this.cashFundCycle[0].salary).toFixed(2) *
              (parseFloat(this.cashFundCycle[0].credit_value).toFixed(2) / 100)
          }
        }
      }
    },
  },
}
</script>
<style scoped>
.ps-3 {
  padding-top: 7px;
  padding-right: 15px;
}
.ps-4 {
  height: 1px;
  background: #f2f2f2;
  margin-top: 7px;
  margin-left: -2rem;
  margin-right: -2rem;
}
.ps-5 {
  margin-top: 2rem;
}
.ps-6 {
  color: #1c1939;
}
</style>
