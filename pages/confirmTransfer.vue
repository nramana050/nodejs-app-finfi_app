<template lang="pug">
    div
      div(v-if="!cashRequestSent && !cashRequestFailed")
        div.flex.flex-row.text-white.border.p-4.items-center.ps-1
          span(@click="navToTransfer") 
            FaIcon.w-4.h-6.mx-auto.ps-2(icon='angle-left')
          span.font-bold.ps-3 Confirm Transfer
        div.ps-4 Enter Your Passcode
        div.flex.flex-row.justify-between.ps-6
          input(type='text'  maxlength='1' id="otp1" v-model="num1" @input="changeRange(0,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(0)")
          input(type='text'  maxlength='1' id="otp2" v-model="num2" @input="changeRange(1,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(1)")
          input(type='text'  maxlength='1' id="otp3" v-model="num3" @input="changeRange(2,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(2)")
          input(type='text'  maxlength='1' id="otp4" v-model="num4" @input="changeRange(3,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(3)")
          input(type='text'  maxlength='1' id="otp5" v-model="num5" @input="changeRange(4,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(4)")
          input(type='text'  maxlength='1' id="otp6" v-model="num6" @input="changeRange(5,$event.target.value,$event)" v-on:keyup.delete="onClickDelete(5)")
        div.flex-0.fixed.bottom-0
          button.btn.h-8.px-4.text-white.rounded.font-bold.ps-5(@click="initCashRequest") Proceed
      div(v-if="cashRequestSent")
        TransferSuccess
      div(v-if="cashRequestFailed")
        TransferFailed(:message="`Your transaction failed due to ${errorMessage}`")
      
</template>
<script>
export default {
  name: 'ConfirmTransfer',
  layout: 'empty',

  data() {
    return {
      passcode: null,
      user: this.$auth.user,
      accounts: [],
      recentTransaction: null,
      inProgress: false,
      availableLimit: null,
      transferAmount: null,
      cashRequestSent: false,
      cashRequestFailed: false,
      errorMessage: '',
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
  methods: {
    navToTransfer() {
      this.$router.push('/TransferScreen')
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
    async passwordVerification() {
      try {
        const regPasscode = await this.$axios.post('/auth/transfer', {
          passcode: this.passcode,
        })
        return regPasscode.data
      } catch (err) {
        this.$toasted.error(err.response.data.message)
      }
    },
    async initCashRequest() {
      try {
        if (this.addNumbers === null) {
          this.$toasted.error('Please enter passcode')
        }
        const regPasscode = await this.$axios.post('/auth/transfer', {
          passcode: this.addNumbers,
        })
        console.log('passcode ', regPasscode)
      } catch (err) {
        this.$toasted.error('Incorrect Passcode')
        return
      }

      // if(regPasscode.statusCode !==200)
      // {
      //   this.$toasted.error('Incorrect passcode')
      //   return
      // }

      this.inProgress = true
      const accountresult = await this.$axios.get('/accounts')
      this.accounts = []
      for (const item of accountresult.data) {
        this.accounts.push(item.account)
      }
      const accountTypes = accountresult.data.map((x) => x.account.account_type)
      const providerFinfi = await this.$axios.post('/ext/service-provider', {
        service_provider: 'FINFI',
      })
      const finfiAccount = this.accounts.filter(
        (item) =>
          item.account_type.toUpperCase() ===
          providerFinfi.data.filter((x) => accountTypes.includes(x))[0]
      )
      const availableLimit = finfiAccount[0].account_balance
      if (this.requestAmount > availableLimit) {
        this.$toast.error(`Cash limit available: ${availableLimit}`)
        this.inProgress = false
        return
      }
      try {
        const bankResult = await this.$axios.get('/profile/banks')
        // eslint-disable-next-line camelcase
        const { ifsc_code, account_balance } = bankResult.data
        // eslint-disable-next-line camelcase
        if (ifsc_code === '' || account_balance === '') {
          this.inProgress = false
          this.$toasted.error(
            'you have missing bank details. Pls update bank details in the profile menu'
          )
          return
        }
        await this.$axios.post(`/accounts/${finfiAccount[0].id}/withdrawals`, {
          amount: this.requestAmount,
        })
        // this.$toast.success('Cash request sent');
        this.cashRequestSent = true
        // this.$router.push('/TransferSuccess')
        this.requestAmount = null
        this.inProgress = false
      } catch (err) {
        this.inProgress = false
        this.errorMessage = err.response.data.message
        this.cashRequestFailed = true
        // this.$toasted.error(err.response.data.message)
      }
    },
  },
}
</script>
<style scoped>
.ps-1 {
  background-color: #7165e3;
  height: 3rem;
}
.ps-2 {
  color: white;
  margin-top: 0.5rem;
  width: 20px;
  height: 20px;
}
.ps-3 {
  padding-top: 5px;
  margin-left: 1rem;
}
.ps-4 {
  text-align: center;
  color: #1c1939cc;
  margin-top: 5rem;
  margin-bottom: 1rem;
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
  margin-left: 3rem;
  margin-right: 3rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
input {
  border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 1px solid black;
  width: 2rem;
  font-size: x-large;
  text-align: center;
}
</style>
