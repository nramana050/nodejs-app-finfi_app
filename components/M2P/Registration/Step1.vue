<template lang="pug">
div.flex.flex-col
  FormulateForm(v-model="form" @submit="next")
    div.flex.flex-row
      FormulateInput.pr-3(type="text" label="First Name" name="first_name" disabled validation="required")
      FormulateInput.pr-3(type="text" label="Last Name" name="last_name" disabled validation="required")
    div.flex.flex-row
      FormulateInput.pb-2.pr-3(type="number" label="Mobile Number" name="mobile" disabled validation="required")
      FormulateInput.pb-2.pr-3(type="text" label="Email" name="email" disabled validation="required")
    div.flex.flex-col
      FormulateInput.pb-2.pr-3(type="number" label="OTP" name="otp" validation="required")
    div.flex-1.pr-4
      div.flex.flex-row.py-4.justify-between
        button.h-8.px-4.text-white.rounded.bg-primary.font-bold(type="submit") Next
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
      }
    }
  },

  mounted() {
    this.generateOTP();
  },

  methods: {
    async generateOTP() {
      await this.$axios.$post('/m2p/otp', {
        headers: {
          'Authorization': this.token
        }
      });
      this.$toast.success('OTP generated and sent to your mobile number');
    },
    next() {
      this.$emit('next', {
        otp: this.form.otp
      });
    },
    cancel() {
      this.$emit('close');
    }
  }
}
</script>