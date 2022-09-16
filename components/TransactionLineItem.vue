<template lang="pug">
  div.flex.flex-row.mt-4.text-sm.items-center.shadow.ps-1
    div.flex-0.text-left.ps-2
      p.text-md {{ date }}
      p.text-sm {{ transaction.comments }}      
    div.flex-1.text-right(:class="{ 'text-green-700': isCredit, 'text-red-700': isDebit }")
      p.text-md.font-bold {{ isCredit ? '+' : (isDebit ? '-' : '') }} {{ parseFloat(transaction.transaction_amount).toLocaleString() }}
</template>

<script>
export default {
  props: {
    transaction: {
      type: Object,
      required: true
    }
  },

  computed: {
    isCredit() {
      return this.transaction.type.toLowerCase() === 'credit'
    },
    isDebit() {
      return this.transaction.type.toLowerCase() === 'debit'
    },
    date() {
      return this.$dayjs(this.transaction.transaction_time).format('YYYY-MM-DD HH:mm:ss')
    },
  }
}
</script>
<style scoped>
  .ps-1{
    height: 13vh;
    border-radius: 8px;
    background-color: white;
    padding-left: 1rem;
  }
  .ps-2{
    color: #1C1939;
  }
</style>