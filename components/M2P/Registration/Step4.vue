<template lang="pug">
div.flex.flex-col
  p(v-if="isLoading") Registering... 
  p(v-else) User registered successfully
  div
    p {{ result }}
</template>

<script>
export default {
  name: 'Step4Component',
  // eslint-disable-next-line vue/require-prop-types
  props: ['form'],

  data() {
    return {
      isLoading: true,
      result: null,
    }
  },

  async mounted() {
    await this.registerAction();
  },

  methods: {
    async registerAction() {
      const result = await this.$axios.$post('/m2p/register', this.form, {
        headers: {
          'Authorization': this.token
        }
      });
      if (result) {
        this.result = result;
        this.isLoading = false;
      }
    }
  }
}
</script>