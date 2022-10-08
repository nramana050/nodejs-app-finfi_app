<template lang="pug">
div.flex.flex-col.p-8
  div.flex
    p.font-bold.tracking-wide.text-lg Confirmation
  div.flex.py-2
    p Are you sure to block your card ?
  div.flex.flex-row.justify-between.pt-4
    button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold(@click="close") Cancel
    button.btn.h-8.px-4.text-white.rounded.font-bold(@click="confirm") Yes, Confirm
</template>

<script>
export default {
  name: 'BlockCard',

  methods: {
    close() {
      this.$FModal.hide()
    },
    async confirm() {
      try {
        await this.$axios.$post('/m2p/cards/block', {
          headers: {
            Authorization: this.token,
          },
        })
        this.$attrs.revert()
        this.$toast.success('Card Blocked Successfully')
      } catch (err) {
        this.$toast.error('Failed')
      }
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
