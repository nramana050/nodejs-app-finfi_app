<template lang="pug">
  div.flex.flex-col
    div.flex-0
    PageHeader(:title="'Transactions'")
    div.flex-0.p-4.bg-gray-100
      div.flex.flex-row.text-centerate.justify-between
        div.flex.flex-0
          span.py-1.px-2.text-xs.text-black.bg-primary.uppercase.font-bold.self-center Date filter
        div.flex.flex-1.w-64.relative
          DatePicker(range input-class="border w-full px-4" placeholder="Select Date Range" :disabled-date="disableDate" v-model="dates" range-separator=' ⟺ ' @change="fetchTransactions")
    div.p-4.text-center(v-if="transactions.length > 0")
      TransactionLineItem.pr-4(:transaction="transaction" v-for="(transaction, index) in transactions" :key="index")
    div.p-4.text-center(v-else-if="isLoading")
      p.text-sm Loading ...
    div.p-4.text-center(v-else)
      p.text-sm No transactions found
</template>

<script>
export default {
  name: 'AccountPage',
  layout: 'session',

  data() {
    return {
      dates: [new Date(), new Date()],
      transactions: [],
      isLoading: false,
    }
  },

  async fetch() {
    await this.fetchTransactions();
  },

  methods: {
    disableDate(date){
       const today = new Date();
      today.setHours(0, 0, 0, 0);
      return  date >= new Date(today.getTime() + 24 * 3600 * 1000);

    },
    async fetchTransactions() {
      this.transactions = []
      this.isLoading = true;
      const startDate = this.$dayjs(this.dates[0]).format('YYYY-MM-DD')
      const endDate = this.$dayjs(this.dates[1]).format('YYYY-MM-DD')
      try {
        const transactions = await this.$axios.get(`/accounts/transactions?start_date=${startDate}&end_date=${endDate}`);
        this.transactions = transactions.data;
        this.isLoading = false;
      } catch (err) {
        this.$toast.error('Failed to fetch accounts');
        this.isLoading = false;
      }
    }
  }
}
</script>
<style scoped>
  .ps-3{
  padding-top: 2rem;
  margin-left: 2rem;
}
.ps-4{
  margin-left: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.ps-5{
  background-color: #7165E3;
}
</style>