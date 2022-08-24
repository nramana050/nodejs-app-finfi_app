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
      p.tracking-wide.text-xs
        | Card Limit
        div(v-tooltip="{ content: `text`, classes: 'tooltip' }")
          solid-information-circle-icon.w-4.h-4.mx-auto
      p.font-bold.tracking-wider.text-sm &#8377; {{ parseFloat(cardLimit).toFixed(2) }}
  div.pt-2
    p.text-xs
      sup.pr-1 *
      | Employer will deduct from the next salary
    p.text-xs.pt-1(v-if="this.fundCycle") 
      sup.pr-1 * 
      | {{this.fundCycle}}
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
      fundCycle:{},
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
    }
  },
  mounted(){
    this.fetchFundCycle();
  },
  methods:{
    async fetchFundCycle(){
      const organiazaitons = await this.$axios.get(`/organizations`)
      const response = await this.$axios.get(`/organizations/${organiazaitons.data[0].id}/funds/tada`)
      this.fundCycle = response.data.message==="Success"?`You are eligible for a limit of Rs: ${response.data.data.credit_value} per day between ${ response.data.data.credit_start_day } and ${response.data.data.credit_end_day} of the month`:null 
    },
    // async hover(){
    //   this.fundCycle = await this.fetchFundCycle()
    //   console.log('fund cycle hovering',this.fundCycle)
    // }
   }
  
}
</script>


<style scoped>
.tooltip {
  opacity: 1 !important;
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}
</style>