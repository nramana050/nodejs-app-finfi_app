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
      p {{ errorMessage }}
      div.flex.flex-col
        button.btn.h-10.px-4.text-white.rounded.font-bold.my-5(@click="restart") Try Again
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
      errorMessage: null,
    }
  },

  async mounted() {
    await this.registerAction()
  },

  methods: {
    async registerAction() {
      this.errorMessage = null
      try {
        await this.$axios.$post('/m2p/register', this.form, {
          headers: {
            'Authorization': this.token
          }
        });
        this.isSuccess = true;
        await this.$axios.$post('/m2p/vkyc')
      } catch (err) {
        this.isSuccess = false
        this.errorMessage = err.response.data.message
      } finally {
        this.isLoading = false
      }
    },
    reload(e) {
      e.preventDefault()
      // this.$emit('reload')
      this.$router.push('/cards')
    },
    restart(e) {
      e.preventDefault()
      this.$emit('restart')
    },
    cancel(e) {
      this.$router.push('/cards')
      e.preventDefault()
    //   this.$emit('close')
    // },
  },
}
}
</script>
<style scoped>
.btn {
  background-color: #7165e3;
}
</style>
