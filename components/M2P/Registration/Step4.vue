<template lang="pug">
div.flex.flex-col.verify-user-details
  div.success-error-screen(v-if="isSuccess || isError")
    div.img-container
      img(src='~/assets/myfinfi-icons/success.png' v-if="isSuccess") 
      img(src='~/assets/myfinfi-icons/error.png' v-if="isError")
    div.successfull(v-if="isSuccess")  
      div.header  
        h4 Congratulations!
      div.success-body  
        p Virtual card generated successfully.
        p Now earn up to 10% on your monthly online spends. Your card is currently locked for security.
      div.header  
        h4 Want more!  
      div.success-body  
        p Order a physical card and earn up to 10% on your in-store transactions also 
          span(@click="requestPhysicalCard") Order Now  
    div.successfull(v-if="isError")
      div.header  
          h4 Failed  
      div.success-body  
          p Virtual card failed to generate due to "error desc from M2P"
    div.actions
      button.goto-home(@click="cancel") Home 
      button.unlock(v-if="isSuccess") Unlock your Card
      button.retry(v-if="isError" @click="restart") Retry

  div.otp-info(v-else)
   h3 Enter the 6 digit OTP
   p Please confirm your request by entering the OTP sent to 
    span 999999999

    div.flex.flex-row.justify-between.ps-6(v-if="!isError && !isSuccess")
          input(type='text'  maxlength='1' id="otp1" v-model="num1" @input="changeRange(0,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(0)")
          input(type='text'  maxlength='1' id="otp2" v-model="num2" @input="changeRange(1,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(1)")
          input(type='text'  maxlength='1' id="otp3" v-model="num3" @input="changeRange(2,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(2)")
          input(type='text'  maxlength='1' id="otp4" v-model="num4" @input="changeRange(3,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(3)")
          input(type='text'  maxlength='1' id="otp5" v-model="num5" @input="changeRange(4,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(4)")
          input(type='text'  maxlength='1' id="otp6" v-model="num6" @input="changeRange(5,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(5)")  
  div.otp-resend(v-if="!isError && !isSuccess")
   span Resend OTP 
    span.resend-button(@click="generateOTP") Resend
  div.flex.flex-col.action(v-if="!isError && !isSuccess")
    button.btn.h-10.px-4.text-white.rounded.font-bold.my-5(@click="registerAction") Confirm
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
      isSuccess: false,
      isError: false,
      otpresend: false,
      defaultTimerValue: 60,
      timerValue: 60,
      errorMessage: null,
      timerFunction: null,
      num1: null,
      num2: null,
      num3: null,
      num4: null,
      num5: null,
      num6: null,
    }
  },

  computed: {
    requestAmount() {
      return this.$store.state.data.requestedAmount
    },
    addNumbers() {
      return (
        this.num1 + this.num2 + this.num3 + this.num4 + this.num5 + this.num6
      )
    },
  },

  async mounted() {
    await this.registerAction()

    // TODO: IMPEMENT RESEND TIMER
    // // setTimeout(() => {
    // //   this.isOTPSent = false
    // //   this.timer = 60
    // // }, 60000)
    // this.timerFunction = setInterval(() => {
    //   this.timer -= 1
    //   if (this.timer === 1) {
    //     clearInterval(this.timerFunction)
    //   }
    // }, 1000)
  },

  methods: {
    async generateOTP() {
      const otpRes = await this.$axios.$post('/m2p/otp', {
        headers: {
          Authorization: this.token,
        },
      })
      if (otpRes?.message === 'Success') {
        this.$toast.success('OTP generated and sent to your mobile number')
      }
    },
    changeRange(index, value, event) {
      if (event.data != null) {
        if (index === 0) {
          document.getElementById('otp2').focus()
        }
        if (index === 1) {
          document.getElementById('otp3').focus()
        }
        if (index === 2) {
          document.getElementById('otp4').focus()
        }
        if (index === 3) {
          document.getElementById('otp5').focus()
        }
        if (index === 4) {
          document.getElementById('otp6').focus()
        }
      }
    },
    onClickDelete(index) {
      if (index === 1) {
        document.getElementById('otp1').focus()
      }
      if (index === 2) {
        document.getElementById('otp2').focus()
      }
      if (index === 3) {
        document.getElementById('otp3').focus()
      }
      if (index === 4) {
        document.getElementById('otp4').focus()
      }
      if (index === 5) {
        document.getElementById('otp5').focus()
      }
    },
    async registerAction() {
      this.errorMessage = null
      try {
        const payload = {
          ...this.form,
        }
        payload.user.otp = this.addNumbers
        await this.$axios.$post('/m2p/register', payload, {
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
    requestPhysicalCard(e) {
      this.$router.push('/RequestPhysical')
      e.preventDefault()
    },
    cancel(e) {
      this.$router.push('/dashboard')
      e.preventDefault()
      //   this.$emit('close')
      // },
    },
  },
}
</script>
<style scoped>
.success-error-screen {
  height: 100vh;
  padding-top: 30px;
}
.success-error-screen > .img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.success-error-screen > .img-container > img {
  width: 171px;
  height: 171px;
}
.success-error-screen > .successfull > .header {
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  text-align: center;
  color: #979797;
  margin-top: 30px;
  margin-bottom: 10px;
}
.success-error-screen > .successfull > .success-body {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #979797;
}
.success-error-screen > .successfull > .success-body p > span {
  letter-spacing: 0.01em;
  color: #7165e3;
}
.success-error-screen > .actions {
  margin-top: 30px;
}
.success-error-screen > .actions > button {
  width: 350px;
  height: 44px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
}
.success-error-screen > .actions > button.goto-home {
  background: #ffffff;
  border: 1px solid #979797;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-align: center;
  color: #7165e3;
}
.success-error-screen > .actions > button.retry,
.success-error-screen > .actions > button.unlock {
  background: #7165e3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-align: center;
  color: #ffffff;
}
.otp-resend {
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.01em;
  color: #9ca3af;
}
.otp-resend > span > span.resend-button {
  color: #7165e3;
  cursor: pointer;
}
.otp-info {
  margin-top: 20px;
}
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
.verify-user-details {
  height: 100vh;
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
.verify-user-details .action {
  position: relative;
  bottom: 0px;
}
.ps-6 {
  margin-left: 0rem;
  margin-right: 0rem;
  margin-top: 2rem;
  margin-bottom: 0rem;
}
input {
  border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 1px solid black;
  width: 2rem;
  font-size: x-large;
  text-align: center;
  width: 44px;
  height: 44px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  margin-right: 10px;
}
</style>
