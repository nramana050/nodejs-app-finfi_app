<template lang="pug">
div.ew-info
  h3 Salary advance
  div.flex.justify-between.ew-stats
    div.flex-0.text-left.stat-container.green
      div.text-xs
        div(class="card-info") Earned
        div.amt.text-sm &#8377; {{earnedData?.earned}}
    div.flex-0.text-left.stat-container.red
      div.text-xs
        div(class="card-info") Withdrawn
        div.amt.text-sm &#8377; {{earnedData?.used}}
    div.flex-0.text-left.stat-container.yellow
      div.text-xs
        div(class="card-info") Available
        div.amt.text-sm &#8377; {{earnedData?.account_balance}}      
  div.ew-action
   button(@click="navToTransferScreen") Transfer to Bank Account
 
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
      earnedCycle: [],
    }
  },
  computed: {
    availableLimit() {
      return this.earnedLimit - this.payableAmount
    },
    payableAmount() {
      const payableAccount = this.accounts.filter(
        (item) => item.account_type.toUpperCase() === 'PAYABLE'
      )
      return payableAccount[0].account_balance || 0
    },
    cashLimit() {
      const cashAccount = this.accounts.filter(
        (item) => item.account_type.toUpperCase() === 'CASH'
      )
      return cashAccount.length > 0 ? cashAccount[0].account_balance : 0
    },
    cardLimit() {
      const cardAccount = this.accounts.filter(
        (item) => item.account_type.toUpperCase() === 'CARD'
      )
      return cardAccount.length > 0 ? cardAccount[0].account_balance : 0
    },
    earnedLimit() {
      const earnedAccount = this.accounts.filter(
        (item) => item.account_type.toUpperCase() === 'EARNED_WAGES'
      )
      return earnedAccount.length > 0 ? earnedAccount[0].earned : 0
    },
    earnedData() {
      const earnedAccount = this.accounts.filter(
        (item) => item.account_type.toUpperCase() === 'EARNED_WAGES'
      )
      return earnedAccount.length > 0 ? earnedAccount[0] : {}
    },
  },
  mounted() {
    this.fetchFundCycle()
  },
  methods: {
    calculateCreditValue(num, percentage) {
      return (num / 100) * percentage
    },
    async fetchFundCycle() {
      const response = await this.$axios.get(`/fundConfig/message`)
      if (response.data.message.toLowerCase() !== 'success') return

      const fundCycle = response.data.result
      if (fundCycle) {
        if (fundCycle.CARD) {
          fundCycle.CARD[0].credit_value =
            fundCycle.CARD[0].credit_method === 'PERCENTAGE'
              ? (fundCycle.CARD[0].credit_value = this.calculateCreditValue(
                  fundCycle.salary,
                  fundCycle.CARD[0].credit_value
                ))
              : fundCycle.CARD[0].credit_value

          this.cardFundCycle = fundCycle.CARD
        }
        if (fundCycle.CASH) {
          fundCycle.CASH[0].credit_value =
            fundCycle.CASH[0].credit_method === 'PERCENTAGE'
              ? (fundCycle.CASH[0].credit_value = this.calculateCreditValue(
                  fundCycle.salary,
                  fundCycle.CASH[0].credit_value
                ))
              : fundCycle.CASH[0].credit_value

          this.cashFundCycle = fundCycle.CASH
        }
        if (fundCycle.EARNED_WAGES) {
          fundCycle.EARNED_WAGES[0].credit_value =
            fundCycle.EARNED_WAGES[0].credit_method === 'PERCENTAGE'
              ? (fundCycle.EARNED_WAGES[0].credit_value =
                  this.calculateCreditValue(
                    fundCycle.salary,
                    fundCycle.EARNED_WAGES[0].credit_value
                  ))
              : fundCycle.EARNED_WAGES[0].credit_value

          this.earnedCycle = fundCycle.EARNED_WAGES
        }
      }
    },
    navToTransferScreen() {
      this.$router.push('/transferscreen')
    },
  },
}
</script>
<style scoped>
.ew-info {
  padding-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  box-shadow: 0px 30px 60px rgba(0, 0, 0, 0.0790811);
}
.ew-info > h3 {
  font-size: 16px;
  line-height: 21px;
}
.ew-stats {
  margin-top: 20px;
}
.stat-container {
  box-shadow: 1px 2px 20px 20px #f0f0f0;
  padding-right: 35px;
  height: 56px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 94px;
}
.stat-container.green {
  border-left: 5px solid #3ba99c;
  border-radius: 5px;
}
.stat-container.red {
  border-left: 5px solid #d3455b;
  border-radius: 5px;
}
.stat-container.yellow {
  border-left: 5px solid #ffd422;
  border-radius: 5px;
}
.card-info {
  padding-left: 5px;
  color: #898a8d;
  font-size: 11px;
}
.amt {
  padding-left: 5px;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 25px;
}
.ew-action {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
}
.ew-action > button {
  width: 232px;
  height: 35px;
  background: #7165e3;
  border-radius: 14px;
  text-align: center;
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 17px;
  color: #ffffff;
}
</style>
