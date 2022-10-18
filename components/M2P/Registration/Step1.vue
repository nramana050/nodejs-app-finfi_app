<template lang="pug">
div.flex.flex-col
  FormulateForm(v-model="form" @submit="next")
    div.flex.flex-row
      FormulateInput.pr-3(type="text" label="First Name" name="first_name" disabled validation="required")
      FormulateInput.pr-3(type="text" label="Last Name" name="last_name" disabled validation="required")
    div.flex.flex-row
      FormulateInput.pb-2.pr-3(type="number" label="Mobile Number" name="mobile" disabled validation="required")
      FormulateInput.pb-2.pr-3(type="text" label="Email" name="email" disabled validation="required")
    div.flex.flex-row
      div.flex-1
        FormulateInput.pr-3(type="select" label="Gender" name="gender" :options="genders" placeholder="Select" validation="required")
      div.flex-1 
        p.p-1 Date Of Birth
        date-picker(v-model="form.dob" valueType="format" placeholder="DOB" :disabled-date="disabledRange") 
    div.flex.flex-cpl
      FormulateInput.pb-2.pr-3.w-full(type="text" label="OTP" name="otp" maxlength="6" validation="required" v-model="otp" @keydown="nameKeydown($event)" )
    div.flex-1.pr-4
      div.flex.flex-row.py-4.justify-between
        button.btn.h-8.px-4.text-white.rounded.font-bold(@click="generateOTP" :disabled="isOTPSent" :class="[isOTPSent ? 'bg-blue-200': 'bg-gray-200']")
          | Send OTP 
          span(v-if="isOTPSent") ({{timer}})
        div(v-if="OTP")
          button.btn.h-8.px-4.text-white.rounded.font-bold(type="submit") Next
        button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold(@click="cancel") Cancel
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
        otp: '',
        gender: '',
        dob: '',
      },
      genders: { M: 'Male', F: 'Female' },
      isOTPSent: false,
      timer: 60,
      timerFunction: null,
    }
  },

  methods: {
    nameKeydown(e) {
      if (/^\W$/.test(e.key)) {
        e.preventDefault();
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
    next() {
      this.$emit('next', {
        otp: this.form.otp,
        gender: this.form.gender,
        dob: this.form.dob,
      })
    },
    cancel(e) {
      e.preventDefault()
      this.$emit('close')
    },
    disabledRange(date) {
      return date > new Date()
    },
  },
}
</script>
<style scoped>
.btn {
  background-color: #7165e3;
}
</style>
