<template lang="pug">
  div.flex.flex-row.mt-4.text-sm.items-center.shadow.px-2.py-1
    div.flex-0.text-left
      p.text-md {{ date }}
      p.text-sm {{ transaction.comments }}      
    div.flex-1.text-right(:class="{ 'text-green-700': isCredit, 'text-red-700': isDebit }")
      p.text-md.font-bold {{ isCredit ? '+' : (isDebit ? '-' : '') }} {{ parseFloat(transaction.transaction_amount).toFixed(2) }}
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
