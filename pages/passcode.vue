<template lang="pug">
  div
    LeadHeader.font-bold.text-2xl.ps-1(:title="`Hello ${user.first_name},`")
    LeadHeader.ps-2(:lead="'Set 6 digit login passcode. You can also set it later under profile menu.'")
    
    div
      input.ps-4(class="focus:outline-none focus:shadow-outline" placeholder="Enter 6 digit passcode" type="numeric" v-model="passcode_1")
      input.ps-4(class="focus:outline-none focus:shadow-outline" placeholder="Confirm passcode" type="numeric" v-model="passcode_2")
    div
      p.ps-6.text-sm.text-black.underline(@click="navToDashboard") Skip to Dashboard
      button.text-white.inline-flex.items-start(@click="setPasscode")
        span.ps-5 Set
        //- outline-arrow-circle-right-icon.w-8.h-8.ml-2
      
</template>

<script>
export default {
  name: 'PasscodePage',
  data() {
    return {
      user: this.$auth.user,
      passcode_1: '',
      passcode_2: '',
      hasError: false,

    }
  },
  methods: {
    async setPasscode() {
      if (this.passcode_1.length !== 6 || this.passcode_2.length !== 6) {
        this.$toast.error('Enter 6 digit numeric passcode')
        return
      }
      if (this.passcode_1 !== this.passcode_2) {
        this.$toast.error('passcode didnot match')
        return
      }
      try {
        const welcome = await this.$axios.post('/profile/welcome')
        console.log(welcome)
        await this.$axios.post('/profile/passcode', {
          passcode: Number(this.passcode_1),
        })
        this.$toast.info('Passcode updated successfully')
        if(welcome.data.message===true)
        {
        this.$router.push('/WelcomePage')
        }
        else{
        this.$router.push('/dashboard')

        }
      } catch (err) {
        this.$toast.error('failed to update passcode')
      }
    },
    navToDashboard() {
      this.$router.push('/dashboard')
    },
  },
}
</script>
<style scoped>
.ps-1 {
  color: #37202b;
  margin-top: 1rem;
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
  padding-left: 10px;
  padding-right: 4.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
}
.ps-5 {
  background-color: #7165e3;
  width: 130px;
  height: 35px;
  font-weight: 500;
  margin-top: 2.5rem;
  margin-left: 7.75rem;
  text-align: center;
  border-radius: 8px;
  padding-top: 5px;
}
.ps-6 {
  margin-top: 1rem;
  margin-left: 3rem;
}
.ps-7 {
  color: #37202b;
  margin-top: 0.5rem;
  margin-left: 3rem;
  width: 20px;
  height: 30px;
}
</style>
