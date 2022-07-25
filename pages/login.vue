<template lang="pug">
div.flex.flex-col
  div.flex.mb-4
    NuxtLink(to="/")
      outline-arrow-circle-left-icon.w-8.h-8.mr-2.text-white
  LeadHeader.flex(:title="organization ? organization.name : ''" :lead="'Please login with your registered mobile number'")
  div.flex.flex-col.py-4
    input.shadow.appearance-none.border.rounded.w-full.py-2.px-3(class="focus:outline-none focus:shadow-outline" placeholder="Mobile number" v-model="mobile")
  div.flex.flex-col.pb-4(v-if="isUserRegistered")
    div(v-if="skipOTP")
      input.shadow.appearance-none.border.rounded.w-full.py-2.px-3.mt-4(class="focus:outline-none focus:shadow-outline" placeholder="Passcode" v-model="passcode")
      p.text-sm.text-white.pt-8.underline(@click="switchToOTPMode") Forgot passcode?
    div(v-else)
      input.shadow.appearance-none.border.rounded.w-full.py-2.px-3.mt-4(class="focus:outline-none focus:shadow-outline" placeholder="OTP" v-model="otp")
      p.text-sm.text-white.pt-8.underline(@click="initiateOTP") Resend OTP
  div.flex.flex-1.justify-end.py-8(v-if="isUserRegistered")
    button.text-white.inline-flex.items-start(@click="login" v-if="skipOTP")
      span.text-xl.tracking-wide Login
      outline-arrow-circle-right-icon.w-8.h-8.ml-2
    button.text-white.inline-flex.items-start(@click="verifyOTP" v-else)
      span.text-xl.tracking-wide Verify
      outline-arrow-circle-right-icon.w-8.h-8.ml-2
  div.flex.flex-1.justify-end.py-8(v-else)
    button.text-white.inline-flex.items-start(@click="validate")
      span.text-xl.tracking-wide Proceed
      outline-arrow-circle-right-icon.w-8.h-8.ml-2
</template>

<script>
export default {
  name: 'LoginPage',
  auth: false,
  data() {
    return {
      mobile: null,
      passcode: null,
      otp: null,
      isUserRegistered: false,
      skipOTP: false,
    }
  },
  computed: { 
    organization() {
      return this.$store.getters.organization;
    },
  },
  beforeMount() {
    if (this.$auth.strategy.token.status().valid()) {
      this.$router.push('/dashboard');
    }
    if (!this.organization) {
      this.$router.push('/')
    }
  },
  methods: {
    async initiateOTP() {
      this.otp = null
      try {
        await this.$axios.$post('/auth/otp', { mobile: Number(this.mobile) }); 
        this.$toast.success('OTP sent!');
      } catch (err) {
        this.$toast.error('Failed to send OTP');    
      }
    },
    async verifyOTP() {
      try {
        const result = await this.$auth.loginWith('otp', { 
          data: {
            mobile: Number(this.mobile),
            otp: Number(this.otp),
            organization_code: this.organization.code
          }
        })
        await this.$auth.setUserToken(result.data.access_token);
        this.$auth.strategy.token.sync();
        this.$router.push('/passcode');
      } catch (err) {
        this.$toast.error('Invalid OTP');
      }
    },
    async login() {
      try {
        const result = await this.$auth.loginWith('token', { 
          data: {
            mobile: Number(this.mobile),
            passcode: Number(this.passcode),
            organization_code: this.organization.code
          }
        })
        await this.$auth.setUserToken(result.data.access_token);
        this.$auth.strategy.token.sync();
        this.$router.push('/dashboard');
      } catch (err) {
        this.$toast.error('Invalid Passcode');
      }
    },
    async validate() {
      if (!this.mobile || this.mobile.length !== 10) {
        this.$toast.error('Provide 10 digit mobile number');
        return;
      }
      const user = await this.$axios.$get(`/ext/user?mobile=${this.mobile}`);
      // eslint-disable-next-line camelcase
      const { status } = user;
      if (!status) {
        this.isUserRegistered = false;
        this.$toast.error('Mobile number not registered');
        return;
      }
      this.isUserRegistered = true;
      // eslint-disable-next-line camelcase
      if (!user.skip_otp) {
        this.initiateOTP();
        return;
      }
      this.skipOTP = true
    },
    switchToOTPMode() {
      this.skipOTP = false;
      this.initiateOTP();
    }
  }
}
</script>
