<template lang="pug">
  div
    div.flex.flex-row.text-white.border.p-4.items-center.ps-9
    //- LeadHeader.font-bold.text-2xl.ps-1(:title="`Hello ${user.first_name},`")
    LeadHeader.font-bold.text-2xl.ps-1(:title="'Set Passcode'")    
    div
      input.ps-4(class="focus:outline-none focus:shadow-outline" placeholder="New passcode" type="password" maxlength="6" v-model="passcode_1")
      input.ps-4(class="focus:outline-none focus:shadow-outline" placeholder="Confirm passcode" type="password" maxlength="6" v-model="passcode_2")
    //- div
      p.ps-6.text-sm.text-black.underline(@click="navToDashboard") Skip to Dashboard
    div.flex-0.fixed.bottom-0
      button.btn.h-8.px-4.text-white.rounded.font-bold.ps-5(@click="setPasscode") Set Passcode
      
</template>

<script>
export default {
  name: 'PasscodePage',
  layout: 'empty',
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
      const passwordPattern = /^\d{6}$/
      const validatePassword = passwordPattern.test(this.passcode_2)

      if (
        this.passcode_1.length !== 6 ||
        this.passcode_2.length !== 6 ||
        !validatePassword
      ) {
        this.$toast.error('Enter 6 digit numeric passcode')
        return
      }
      if (this.passcode_1 !== this.passcode_2) {
        this.$toast.error('passcode didnot match')
        return
      }
      try {
        const welcome = await this.$axios.post('/profile/welcome')
        await this.$axios.post('/profile/passcode', {
          passcode: Number(this.passcode_1),
        })
        this.$toast.info('Passcode updated successfully')
        if (welcome.data.message === true) {
          this.$router.push('/welcomepage')
        } else {
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
  text-align: center;
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
.ps-9 {
  background-color: #7165e3;
  height: 3rem;
}
</style>
