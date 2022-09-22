<template lang="pug">
div
  div
    NuxtLink(to="/")
      FaIcon.mx-auto.ps-7(icon='angle-left')
      LeadHeader.font-bold.text-2xl.ps-1(:title="organization ? organization.name : ''" )
      LeadHeader.ps-2(:lead="'Please login with your registered'")
      LeadHeader.ps-3(:lead="'mobile number'")

  div
    input.ps-4(class="focus:outline-none focus:shadow-outline" placeholder="Mobile number" v-model="mobile")
  div(v-if="isUserRegistered")
    div(v-if="skipOTP")
      input.ps-4(class="focus:outline-none focus:shadow-outline" type="password" placeholder="Passcode" v-model="passcode")
      div.flex.flex-row.justify-evenly
        p.ps-8.text-sm.underline(@click="switchToOTPMode") Forgot passcode?
        p.ps-10.text-sm.underline(@click="switchToOTPMode") Send OTP
    div(v-else)
      input.ps-4(class="focus:outline-none focus:shadow-outline" placeholder="OTP" type="password" v-model="otp")
      p.text-sm.ps-6.underline(@click="initiateOTP" :hidden='this.blockResend' ) Resend OTP
      p.text-sm.ps-6( id="waitTime" :hidden='!this.blockResend' )
  div.ps-5(v-if="isUserRegistered")
    button.font-bold.text-white(@click="login" v-if="skipOTP")
      span Login
      //- outline-arrow-circle-right-icon.w-8.h-8.ml-2
    button.font-bold.text-white(@click="verifyOTP" v-else)
      span Verify
      //- outline-arrow-circle-right-icon.w-8.h-8.ml-2
  div.ps-5(v-else)
    button.font-bold.text-white(@click="validate")
      span Proceed
      //-outline-arrow-circle-right-icon.w-8.h-8.ml-2
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
      initiateOTPCount:0,
      blockResend: false,
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
        this.initiateOTPCount+=1
        await this.$axios.$post('/auth/otp', { mobile: Number(this.mobile), source:'app' }); 
        // this.$toast.success('OTP sent!');
        if (this.initiateOTPCount>1){
          this.$toast.error('Too many resend attempts !')
          this.blockResend = true
          let i = 60;
          const startCount = setInterval(()=>{
            document.getElementById("waitTime").innerHTML = 'wait for ' + String(i)+' seconds';
            if (i === 0){
              clearInterval(startCount)
              document.getElementById("waitTime").innerHTML = null;
              this.initiateOTPCount=0
              this.blockResend = false
            }else{
              i--;
            }
          },1000);
        }else{
          this.$toast.success('OTP sent!');
        }
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
            organization_code: this.organization.code.toUpperCase()
          }
        });
        await this.$auth.setUserToken(result.data.access_token);
        this.$auth.strategy.token.sync();
        this.$router.push('/passcode');
      } catch (err) {
        this.$toast.error(err.response.data.message);
      }
    },
    async login() {
      try {
        const result = await this.$auth.loginWith('token', { 
          data: {
            mobile: Number(this.mobile),
            passcode: Number(this.passcode),
            organization_code: this.organization.code.toUpperCase()
          }
        });
        await this.$auth.setUserToken(result.data.access_token);
        this.$auth.strategy.token.sync();
        this.$router.push('/dashboard');
      } catch (err) {
        this.$toast.error(err.response.data.message);
      }
    },
    async validate() {
      if (!this.mobile || this.mobile.length !== 10) {
        this.$toast.error('Provide 10 digit mobile number');
        return;
      }
      if (isNaN(this.mobile)){
        this.$toast.error('Mobile number must contain only numbers');
        return;
      }
      const user = await this.$axios.$post(`/ext/user`,{mobile : Number(this.mobile)});
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
<style scoped>
  .ps-1{
    color: #37202B;
    margin-top: 1rem;
    margin-left:3rem;
    font-weight: 300;
    letter-spacing: -2px;
    font-style: normal;
  }
  .ps-2{
   color: #1C1939CC;
   margin-top: 1rem;
   font-weight: 400;
   margin-left:3rem;
   margin-right:3rem;
  }
  .ps-3{
    color: #1C1939CC;
    font-weight: 400;
    margin-left:3rem;
    margin-right:3rem;
  }
  .ps-4{
    margin-left: 3rem;
    margin-top: 1rem;
    padding-left: 10px;
    padding-right: 4.75rem;
    padding-top: 10px;
    padding-bottom:10px;
  }
  .ps-5{
    background-color: #7165E3;
    width: 130px;
    height: 35px;
    font-weight: 500;
    margin-top: 2.5rem;
    margin-left:7.75rem;
    text-align: center;
    border-radius: 8px;
    padding-top: 5px;
  }
  .ps-8{
    margin-top: 1rem;
    margin-left: -3rem;
  }
  .ps-6{
    margin-top: 1rem;
    margin-left: 3rem;
  }
  .ps-7{
    color: #37202B;
    margin-top: 0.5rem;
    margin-left: 3rem;
    width: 20px;
    height: 20px;
  }
  .ps-10{
    margin-top: 1rem;
    margin-right: -3rem;
  }
</style>