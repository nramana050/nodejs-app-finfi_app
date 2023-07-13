<template lang="pug">
div.flex.flex-col.verify-user-details
  FormulateForm(v-model="form" @submit="next")
    div
      FormulateInput(type="text" label="First Name as per Aadhaar" name="first_name" validation="required")
    div
      FormulateInput(type="text" label="Last Name as per Aadhaar" name="last_name"  validation="required")
    div
      FormulateInput.pb-2(type="number" label="Mobile number registered with Aadhaar" name="mobile"  validation="required")
    div
      FormulateInput.pb-2(type="text" label="eMail ID" name="email"  validation="required")
    div
      div.flex-1.mb-3
        FormulateInput(type="radio" label="Gender" name="gender" :options="genders" placeholder="Select" validation="required")
      div.flex-1 
        p.p-1.custom-label Date of Birth
        date-picker(v-model="form.dob" valueType="format" placeholder="DOB" :disabled-date="disabledRange" :input-attr="{required: 'true'}") 
    div.action 
      //- div.flex.flex-cpl.tnc-block
      //-   FormulateInput(type="checkbox" name="agree" v-model="agree" )
      //-   div.tnc I have read & agreed to the 
      //-   a(@click="navToTnC" target="_blank") Terms & Conditions.
      //- div.req-msg(v-if='!this.agree') Check Terms & Conditions  
      div.flex.flex-cpl
        button(type="submit" :disabled="!this.agree" :class="`btn h-8 px-4 text-white rounded font-bold ${!agree? 'disabled':' '}`" ) Confirm
</template>

<script>
export default {
  name: 'Step1Component',

  data() {
    return {
      user: this.$auth.user,
      token: this.$auth.strategy.token.get(),
      form: {
        first_name: this.$auth.user.first_name,
        last_name: this.$auth.user.last_name,
        mobile: this.$auth.user.mobile,
        email: this.$auth.user.email,
        // otp: '',
        gender: '',
        dob: '',
      },
      agree: true,
      genders: { M: 'Male', F: 'Female', O: 'Others' },
      isOTPSent: false,
      timer: 60,
      timerFunction: null,
    }
  },

  methods: {
    navToTnC() {
      this.$router.push('/TermsAndConditions')
    },
    nameKeydown(e) {
      if (/^\W$/.test(e.key)) {
        e.preventDefault()
      }
    },
    async generateOTP(e) {
      e.preventDefault()
      await this.$axios.$post('/m2p/otp', {
        headers: {
          Authorization: this.token,
        },
      })
      this.$toast.success('OTP generated and sent to your mobile number')
      this.isOTPSent = true
      setTimeout(() => {
        this.isOTPSent = false
        this.timer = 60
      }, 60000)
      this.timerFunction = setInterval(() => {
        this.timer -= 1
        if (this.timer === 1) {
          clearInterval(this.timerFunction)
        }
      }, 1000)
    },
    async next() {
      try {
        // TODO: This function need to call in parent
        
        await this.$axios.$post(
          '/profile/update',
          {
            ...this.form,
          },
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
      } catch (err) {
        this.$toast.error('Failed to update the profile.')
      }
      this.$emit('next', this.form)
    },
    cancel(e) {
      this.$router.push('/cards')
      e.preventDefault()
      // this.$emit('close')
    },
    disabledRange(date) {
      return date > new Date()
    },
  },
}
</script>
<style>
.req-msg {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #ff5141;
  margin-bottom: 15px;
  padding-left: 7px;
}
.verify-user-details {
  height: 100vh;
}
.verify-user-details > form {
  margin-top: 20px;
  min-height: 100vh;
}
.verify-user-details > form > div {
  margin-bottom: 10px;
}
.verify-user-details > form label {
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1px;
  color: #979797;
}
.verify-user-details .custom-label {
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1px;
  color: #979797;
}
.verify-user-details > .formulate-form input {
  border: 1px solid #e9f0e6;
  border-radius: 12px;
  height: 42px;
  width: 100%;
  text-align: left;
}
.verify-user-details > .formulate-form input[type='checkbox'] {
  height: 18px;
  margin-right: 20px;
}
.verify-user-details .mx-datepicker {
  width: 100%;
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
.verify-user-details .btn.disabled {
  background: #979797;
}

.formulate-input-element.formulate-input-element--group > div {
  border: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  box-shadow: 0px 2px 48px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  margin: 0 10px;
  height: 42px;
}
.formulate-input-element.formulate-input-element--group > div > div {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
.formulate-input-element.formulate-input-element--group
  > div
  > div
  > div[data-type='radio'] {
  opacity: 0;
}
.formulate-input-element.formulate-input-element--group
  > div[data-has-value='true'] {
  background-color: #7165e3 !important;
}
.formulate-input-element.formulate-input-element--group
  > div[data-has-value='true']
  > div
  > label {
  color: #ffffff;
}
.formulate-input-element.formulate-input-element--group,
.formulate-input-element.formulate-input-element--group
  > div
  .formulate-input-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
}
.formulate-input-element.formulate-input-element--group
  > div
  .formulate-input-wrapper
  label {
  position: absolute;
  top: 15px;
  height: 100%;
  width: 100%;
  text-align: center;
}
.formulate-input-element.formulate-input-element--radio {
  display: flex;
}
.formulate-input-element.formulate-input-element--radio input {
  height: initial;
}
.tnc-block {
  margin: 15px 0px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #898a8d;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 5px;
}
.tnc-block a {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-decoration-line: underline;
  color: #7165e3;
}
.action {
  position: relative;
  bottom: 0px;
}
</style>
