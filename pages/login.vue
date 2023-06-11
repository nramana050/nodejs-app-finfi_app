<template lang="pug">
div.ps-c
  div
    div.flex.flex-row.text-white.border.p-4.items-center.ps-9
      //- NuxtLink(to="/")
      //-   FaIcon.mx-auto.ps-7(icon='angle-left')
    div(v-if="!this.otpSent")
      LeadHeader.font-bold.text-2xl.ps-1(title="Welcome")
      LeadHeader.ps-2(:lead="'Please enter the mobile number'")
      LeadHeader.ps-3(:lead="'that is registered with your employer'")
    div(v-else)
      LeadHeader.ps-2(:lead="`Enter OTP sent to ${mobile}`")
  div(v-if="!this.otpSent")
    input.ps-4(class="focus:outline-none focus:shadow-outline" placeholder="Mobile number" v-model="mobile")
  div(v-if="isUserRegistered")
    div(v-if="skipOTP")
      input.ps-4(class="focus:outline-none focus:shadow-outline" type="password" placeholder="Passcode" v-model="passcode")
      div.ps-8
        button.text-sm.underline(@click="switchToOTPMode") Forgot passcode?
    div(v-else)
      input.ps-4(class="focus:outline-none focus:shadow-outline" placeholder="OTP" type="password" v-model="otp")
      button.text-sm.ps-6.underline(@click="initiateOTP" :hidden='this.blockResend' ) Resend OTP
      button.text-sm.ps-6( id="waitTime" :hidden='!this.blockResend' )
      div.ps-11
        input(v-model="isTermsAccepted" :true-value="true" :false-value="false" type="checkbox")
        label.text-sm  I accept the 
        a.font-bold.text-blue-800.text-sm(href='https://www.myfinfi.com/t-c-for-app-usage' target="_blank") Terms and Conditions 
  div.flex-0.fixed.bottom-0(v-if="isUserRegistered && skipOTP")
    button.btn.h-8.px-4.text-white.rounded.font-bold.ps-5(@click="login" v-if="skipOTP") Login
  div.flex-0.fixed.bottom-0(v-if="isTermsAccepted")
    button.btn.h-8.px-4.text-white.rounded.font-bold.ps-5(@click="verifyOTP" v-if="isTermsAccepted") Confirm OTP
  div.flex-0.fixed.bottom-0(v-if="!isUserRegistered")
    button.btn.h-8.px-4.text-white.rounded.font-bold.ps-5(@click="validate") Proceed

</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'empty',
  auth: false,
  data() {
    return {
      mobile: null,
      passcode: null,
      otp: null,
      isUserRegistered: false,
      skipOTP: false,
      initiateOTPCount: 0,
      blockResend: false,
      isTermsAccepted: false,
      otpSent: false,
    }
  },
  computed: {
    organization() {
      return this.$store.getters.organization
    },
  },
  beforeMount() {
    if (this.$auth.strategy.token.status().valid()) {
      this.$router.push('/dashboard')
    }
    if (!this.organization) {
      this.$router.push('/login')
    }
  },
  methods: {
    setOrganization(organizationStatus, organizationCode, organizationName) {
      if (organizationStatus === 'INACTIVE') {
        this.$toast.error('Organization not registered')
        return false
      }

      // console.log(organizationCode,organizationName)
      this.$store.commit('set', {
        param: 'organization',
        value: { organizationCode, organizationName },
      })

      return true
    },

    async initiateOTP() {
      this.otp = null
      try {
        this.otpSent = true
        this.initiateOTPCount += 1
        await this.$axios.$post('/auth/otp', {
          mobile: Number(this.mobile),
          source: 'app',
        })
        // this.$toast.success('OTP sent!');
        if (this.initiateOTPCount > 1) {
          this.$toast.error('Too many resend attempts !')
          this.blockResend = true
          let i = 60
          const startCount = setInterval(() => {
            document.getElementById('waitTime').innerHTML =
              'wait for ' + String(i) + ' seconds'
            if (i === 0) {
              clearInterval(startCount)
              document.getElementById('waitTime').innerHTML = null
              this.initiateOTPCount = 0
              this.blockResend = false
            } else {
              i--
            }
          }, 1000)
        } else {
          this.$toast.success('OTP sent!')
        }
      } catch (err) {
        this.$toast.error('Failed to send OTP')
      }
    },
    async verifyOTP() {
      try {
        const result = await this.$auth.loginWith('otp', {
          data: {
            mobile: Number(this.mobile),
            otp: Number(this.otp),
            organization_code: this.organization.organizationCode.toUpperCase(),
          },
        })
        await this.$auth.setUserToken(result.data.access_token)
        this.$auth.strategy.token.sync()
        this.$router.push('/passcode')
      } catch (err) {
        this.$toast.error(err.response.data.message)
      }
    },
    async login() {
      try {
        const result = await this.$auth.loginWith('token', {
          data: {
            mobile: Number(this.mobile),
            passcode: this.passcode,
            organization_code: this.organization.organizationCode.toUpperCase(),
          },
        })
        await this.$auth.setUserToken(result.data.access_token)
        this.$auth.strategy.token.sync()
        this.$router.push('/dashBoard')
        // if(this.isTermsAccepted && !this.skipOTP){
        //   this.$router.push('/WelcomeScreen');
        // }else
        //   this.$router.push('/dashBoard');
        // }
      } catch (err) {
        if (this.passcode == null) {
          this.$toast.error('Please enter passcode')
        } else {
          this.$toast.error(err.response.data.message)
        }
      }
    },
    async validate() {
      if (!this.mobile || this.mobile.length !== 10) {
        this.$toast.error('Provide 10 digit mobile number')
        return
      }
      if (isNaN(this.mobile)) {
        this.$toast.error('Mobile number must contain only numbers')
        return
      }
      const user = await this.$axios.$post(`/ext/user`, {
        // orginazation id
        mobile: Number(this.mobile),
      })
      // eslint-disable-next-line camelcase
      const {
        status,
        organization_status,
        organization_code,
        organization_name,
      } = user
      // console.log(organization_status,organization_code)
      if (!status) {
        this.isUserRegistered = false
        this.$toast.error('Mobile number not registered')
        return
      }
      const orgStatus = this.setOrganization(
        organization_status,
        organization_code,
        organization_name
      )

      // console.log("Org status set ",orgStatus)
      // console.log(this.organization.organizationCode.toUpperCase())
      if (orgStatus) {
        this.isUserRegistered = true
      }
      if (!user.skip_otp) {
        this.initiateOTP()
        return
      }
      this.skipOTP = true
    },
    switchToOTPMode() {
      this.skipOTP = false
      this.initiateOTP()
    },
  },
}
</script>
<style scoped>
.ps-c {
  background-color: white;
  height: 100vh;
}
.ps-1 {
  color: #37202b;
  margin-top: 1rem;
  text-align: left;
  margin-left: 3rem;
  font-weight: 300;
  letter-spacing: -2px;
  font-style: normal;
}
.ps-2 {
  color: #1c1939cc;
  margin-top: 1rem;
  font-weight: 400;
  margin-left: 3rem;
  margin-right: 3rem;
}
.ps-3 {
  color: #1c1939cc;
  font-weight: 400;
  margin-left: 3rem;
  margin-right: 3rem;
}
.ps-4 {
  margin-left: 3rem;
  margin-top: 1rem;
  margin-right: 3rem;
  padding-left: 10px;
  padding-right: 4.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid #ccc;
}
.ps-5 {
  color: white;
  background-color: #7165e3;
  height: 2.5rem;
  width: 20rem;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-bottom: 2rem;
}
.ps-8 {
  margin-left: 3rem;
  margin-top: 1rem;
}
.ps-6 {
  margin-top: 1rem;
  margin-left: 3rem;
}
.ps-7 {
  color: white;
  margin-top: 0.5rem;
  width: 20px;
  height: 20px;
}
.ps-10 {
  margin-top: 1rem;
  margin-right: -3rem;
}
.ps-11 {
  margin: 3rem;
}
.ps-9 {
  background-color: #7165e3;
  height: 3rem;
}
</style>
