<template lang="pug">
div.flex.flex-col.verify-user-details
  div.otp-info
   h3 Enter the 6 digit OTP
   p Please confirm your request by entering the OTP sent to 
    span 999999999

  div.flex.flex-col
    button.btn.h-10.px-4.text-white.rounded.font-bold.my-5(@click="restart") Confirm
  //- div(v-if="isLoading")
  //-   p Registering... Please wait
  //- div(v-else)
  //-   div(v-if="isSuccess")
  //-     p Card created successfully
  //-     div.flex
  //-       button.h-10.px-4.text-white.rounded.bg-gray-900.font-bold(@click="reload") View Card
  //-   div(v-else)
  //-     p Failed to register card
  //-     p {{ errorMessage }}
  //-     div.flex.flex-col
  //-       button.btn.h-10.px-4.text-white.rounded.font-bold.my-5(@click="restart") Try Again
  //-       button.h-10.px-4.text-white.rounded.bg-gray-900.font-bold(@click="cancel") Cancel
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
            Authorization: this.token,
          },
        })
        this.isSuccess = true
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
  },
}
</script>
<style scoped>
.otp-info h3 {
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  letter-spacing: 0.01em;
  color: #111827;
  margin-bottom: 15px;
}
.otp-info p {
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  letter-spacing: 0.01em;
  color: #6b7280;
  margin-bottom: 15px;
}
.otp-info p > span {
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  letter-spacing: 0.01em;
  color: #111827;
}
.verify-user-details .btn {
  height: 44px;
  background: #7165e3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  width: 100%;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
