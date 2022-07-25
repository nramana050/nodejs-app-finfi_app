<template lang="pug">
div.flex.flex-col.p-8
  div.flex
    p.font-bold.tracking-wide.text-lg Set PIN
  div.flex.flex-col.py-2
    p Keep the following values handy and click continue to set new PIN
    ul.list-disc.list-inside
      li Card Number
      li Kit Number (Available in card screen)
      li Date of Birth
  div.flex.flex-row.justify-between.pt-4
    button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold(@click="close") Cancel
    button.h-8.px-4.text-white.rounded.bg-primary.font-bold(@click="confirm") Continue
</template>

<script>
export default {
  name: 'SetPIN',

  methods: {
    close() {
      this.$FModal.hide();
    },
    async confirm() {
      try {
        const apiResult = await this.$axios.$post('/m2p/cards/pin', {
          headers: {
            'Authorization': this.token
          }
        });
        const url = apiResult.result;
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
      } catch (err) {
        this.$toast.error('Failed')
      }
      this.close();
    },
  }
}
</script>