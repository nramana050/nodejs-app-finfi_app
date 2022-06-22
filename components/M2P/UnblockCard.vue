<template lang="pug">
div.flex.flex-col.p-8
  div.flex
    p.font-bold.tracking-wide.text-lg Confirmation
  div.flex.py-2
    p Are you sure to unlock your card ?
  div.flex.flex-row.justify-between.pt-4
    button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold(@click="close") Cancel
    button.h-8.px-4.text-white.rounded.bg-primary.font-bold(@click="confirm") Yes, Confirm
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
      } catch (err) {
        this.$toast.error('Failed')
      }
      this.close();
    },
  }
}
</script>