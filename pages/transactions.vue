<template lang="pug">
  div.flex.flex-col
    div.flex-0
    PageHeader.uppercase(:title="'History'")
    div.flex-0.p-4
      div.flex.flex-row.text-centerate.justify-between
        div.flex.flex-0
          span.py-1.px-2.text-xs.text-black.bg.uppercase.font-bold.self-center Date filter
        div.flex.flex-1.w-64.relative
          DatePicker(range input-class="border w-full px-4" placeholder="Select Date Range" :disabled-date="disableDate" v-model="dates" range-separator=' ⟺ ' @change="fetchTransactions")
      
    div
      TransactionLineItem.ps1(:transactions="transactions" )

    div(v-if="transactions.length===0")
      div.msg
        p.p-8 There were no transactions between the specified dates.
    //- div.p-4.text-center(v-else-if="isLoading")
    //-   p.text-sm Loading ...
    //- div.p-4.text-center(v-else)
    //-   p.text-sm No transactions found
</template>

<script>
export default {
  name: 'AccountPage',
  layout: 'empty',

  data() {
    return {
      dates: [new Date(), new Date()],
      transactions: [],
      isLoading: false,
    }
  },

  async fetch() {
    await this.fetchTransactions()
  },

  methods: {
    disableDate(date) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date >= new Date(today.getTime() + 24 * 3600 * 1000)
    },

    async fetchTransactions() {
      this.transactions = []
      this.isLoading = true
      const startDate = this.$dayjs(this.dates[0]).format('YYYY-MM-DD')
      const endDate = this.$dayjs(this.dates[1]).format('YYYY-MM-DD')

      try {
        const transactions = await this.$axios.get(
          `/accounts/transactions?start_date=${startDate}&end_date=${endDate}`
        )
        this.transactions = transactions.data
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
      }
    },
  },
}
</script>
<style scoped>
.msg {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 50vh;
  justify-content: center;
}
</style>
