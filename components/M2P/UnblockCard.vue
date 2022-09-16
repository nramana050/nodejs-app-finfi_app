<template lang="pug">
div.flex.flex-col.p-8
  div.flex
    p.font-bold.tracking-wide.text-lg Confirmation
  div.flex.py-2
    p Are you sure to unblock your card ?
  div.flex.flex-row.justify-between.pt-4
    button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold(@click="close") Cancel
    button.h-8.px-4.text-white.rounded.font-bold.ps-15(@click="confirm") Yes, Confirm
</template>

<script>
export default {
  name: 'UnblockCard',

  methods: {
    close() {
      this.$FModal.hide();
    },
    async confirm() {
      try {
        await this.$axios.$post('/m2p/cards/unblock', {
          headers: {
            'Authorization': this.token
          }
        });
        this.$attrs.revert();
        this.$toast.success('Card unblocked');
      } catch (err) {
        this.$toast.error('Failed')
      }
      this.$FModal.hide();
    },
  }
}
</script>
<style scoped>
  .ps-15{
    background-color: #7165E3;
  }
</style>