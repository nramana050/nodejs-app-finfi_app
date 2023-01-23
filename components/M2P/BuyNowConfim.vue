<template lang="pug">
div.flex.flex-col.p-8
  div.flex
    p.font-bold.tracking-wide.text-lg Thank you for your purchase.
  div.flex.py-2
    p Amount &#8377;{{this.$attrs.amt||0}} will be deducted from your earned wages.
  p Please confirm.
  div.flex.flex-row.justify-between.pt-4
    button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold(@click="close") Cancel
    button.btn.h-8.px-4.text-white.rounded.font-bold(@click="confirm") Yes, Confirm
</template>

<script>
export default {
  name: 'BuyNowConfim',

  methods: {
    close() {
      this.$FModal.hide()
    },
    confirm() {
      this.$attrs.buyNow(false)
      this.$FModal.hide()
    },
  },
}
</script>
<style scoped>
.btn {
  background-color: #7165e3;
}
</style>
