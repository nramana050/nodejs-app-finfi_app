<template lang="pug">
div.flex.flex-col
  div(v-if="isLoading")
    p Registering... Please wait
  div(v-else)
    div(v-if="isSuccess")
      p Card created successfully
      div.flex
        button.h-10.px-4.text-white.rounded.bg-gray-900.font-bold(@click="reload") View Card
    div(v-else)
      p Failed to register card
      div.flex.flex-col
        button.h-10.px-4.text-white.rounded.bg-primary.font-bold.my-5(@click="restart") Try Again
        button.h-10.px-4.text-white.rounded.bg-gray-900.font-bold(@click="cancel") Cancel
</template>

<script>
export default {
  name: 'Step4Component',
  // eslint-disable-next-line vue/require-prop-types
  props: ['form'],

  data() {
    return {
      isLoading: true,
      isSuccess: true,
    }
  },

  async mounted() {
    await this.registerAction();
  },

  methods: {
    async registerAction() {
      try {
        await this.$axios.$post('/m2p/register', this.form, {
          headers: {
            'Authorization': this.token
          }
        });
        this.isSuccess = true;
      } catch (err) {
        this.isSuccess = false;
      } finally {
        this.isLoading = false;
      }
    },
    reload(e) {
      e.preventDefault();
      this.$emit('reload');
    },
    restart(e) {
      e.preventDefault();
      this.$emit('restart');
    },
    cancel(e) {
      e.preventDefault();
      this.$emit('close');
    }
  }
}
</script>