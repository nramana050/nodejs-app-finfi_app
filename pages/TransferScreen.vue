<template lang="pug">
div
  div.ps-1
    button(@click="navToDashboard")
      FaIcon.mx-auto.ps-7(icon='angle-left')
    div.grid.text-center
    FaIcon.w-4.h-6.mx-auto.ps-10(icon='building-columns')
    div.ps-2.text-xm.text-center Transfer to your Bank account 
    div.ps-3.text-sm.text-center A/C number-{{bank.account_number}}
    div.flex.flex-row.justify-evenly
      div.text-3xl.ps-6 &#8377;
      input.text-3xl.ps-8(class="focus:outline-none" ref="amountfeild" type="numeric" v-model="requestedAmount")
    //- div
    //-   div(v-if="requestedAmount>0")
    //-     button.ps-5.font-bold.text-white(@click="initCashRequest")
    //-       span(v-if="inProgress")
    //-         LoadingIcon.w-6.h-6.text-black.mx-auto
    //-       span(v-else) Transfer

    div.upload-container(v-if="isBank_transfer_document_required !== 'NO'")
      form.flex.justify-center.mt-6(@submit.prevent="uploadAttachment")
          div.form-item.flex.text-sm.text-gray-600
            label(class="addproofs relative cursor-pointer rounded-md bg-white font-medium text-indigo-600" for="addproofs")
              span(class="w-72 inline-flex justify-center rounded-md bg-white py-2 px-3 text-sm font-semibold border border-indigo-600 text-indigo-600 shadow-sm") Upload File(s)
                span.isRequired(v-if="isUploadRequired") *
              input(type="file" class="file sr-only" id="addproofs" accept="image/png, image/jpeg" ref="uploader" @change="selectLocalFiles($event)" multiple) 
      ul.px-8.mt-6.list-decimal(v-if="attachments?.length")
            li.file-item.flex.justify-between.mt-2(v-for="(file, idx) in attachments" :key="idx") 
              span {{file?.name}}
              span.deleteFile.cursor-pointer.text-red-600(@click.stop="()=>onDeleteFile(idx)")  
                FaIcon(icon='trash')

    div(v-if="requestedAmount>0 && isUpload")
      div.flex-0.fixed.bottom-0
        button.btn.h-8.px-4.text-white.rounded.font-bold.ps-5(@click="requestAmount")
          span Transfer &#8377; {{transferAmount}}
    
</template>
<script>
export default {
  name: 'TransferScreen',
  layout: 'empty',

  data() {
    return {
      user: this.$auth.user,
      attachments: [],
      accounts: [],
      requestedAmount: null,
      recentTransaction: null,
      inProgress: false,
      availableLimit: null,
      transferAmount: 0,
      amount: [],
      bank: {
        ifsc_code: null,
        account_number: null,
      },
      interval: null,
      isBank_transfer_document_required: null,
      isUploadRequired: false,
    }
  },
  // async fetch() {
  //   await this.getAccountDetails()
  // },
  async fetch() {
    const profileResult = await this.$axios.get('/profile')
    this.profile = profileResult.data
    await this.getBankAccount()
  },
  mounted() {
    const _this = this
    this.$refs.amountfeild.focus()
    this.$emit('requestAmount', this.amount)
    this.interval = setInterval(function () {
      _this.transferAmount = _this.requestedAmount
    }, 1000)

    this.isBank_transfer_document_required =
      this.$store.getters.getOrgConfig?.bank_transfer_document_required
    this.isUploadRequired =
      this.$store.getters.getOrgConfig?.bank_transfer_document_required ===
      'MANDATORY'
  },
  destroyed() {
    clearInterval(this.interval)
  },
  computed: {
    isUpload() {
      if (this.isUploadRequired && this.attachments?.length <= 0) {
        return false
      }
      return true
    },
  },
  methods: {
    navToDashboard() {
      this.$router.push('/workforce/dashboardscreen')
    },
    async getBankAccount() {
      try {
        const bankResult = await this.$axios.get('/profile/banks')
        if (bankResult.data) {
          this.bank = bankResult.data
        }
      } catch (err) {
        this.$toast.error('Failed to fetch profile')
      }
    },
    requestAmount() {
      this.amount = []
      this.uploadAttachment()

      this.amount.push(this.transferAmount)
      this.$store.commit('setrequestAmount', this.transferAmount)
      this.$store.commit('requestDocumentForBankTransfer', this.attachments)
      // alert(this.$store.state.data.attachments.length)
      this.$router.push('/confirmTransfer')
    },
    //   async getAccountDetails() {
    //   try {
    //     const accountresult = await this.$axios.get('/accounts')
    //     this.accounts = [];
    //     for (const item of accountresult.data){
    //       this.accounts.push(item.account)
    //     }
    //     const accountTypes = accountresult.data.map((x)=>x.account.account_type)
    //     const providerFinfi = await this.$axios.post('/ext/service-provider',{ service_provider : 'FINFI'})
    //     const providerM2P = await this.$axios.post('/ext/service-provider',{ service_provider : 'M2P'})

    //     const finfiAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === providerFinfi.data.filter(x=>accountTypes.includes(x))[0])  ;
    //     const m2pAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === providerM2P.data.filter(x=>accountTypes.includes(x))[0] ) ;
    //     console.log('f m accs',finfiAccount,m2pAccount)

    //     this.availableLimit =
    //       ( finfiAccount.length>0 ? finfiAccount[0].account_balance : 0
    //       + m2pAccount.length>0 ? m2pAccount[0].account_balance : 0 ).toLocaleString('en-IN')

    //     if (finfiAccount.length>0)
    //       await this.fetchRecentWithdrawal(finfiAccount[0].id);

    //   } catch (err) {
    //     console.log(err)
    //     this.$toast.error('Failed to fetch accounts');
    //   }
    // },
    async initCashRequest() {
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
      if (this.requestedAmount > availableLimit) {
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
          amount: this.requestedAmount,
        })
        this.$toast.success('Cash request sent')
        this.requestedAmount = null
        this.inProgress = false
      } catch (err) {
        this.inProgress = false
        this.$toasted.error(err.response.data.message)
      }
    },

    selectLocalFiles(event) {
      const files = event.target.files
      // console.log(files)
      const errors = []
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png']
      const allowedFileSize = 2 * 1024 * 1024
      if (Object.keys(files)?.length) {
        Object.keys(files).forEach((file) => {
          if (!allowedFormats?.includes(files[file].type)) {
            errors.push({
              name: files[file].name,
              message: 'Allowed formats are [.jpg,.jpeg,.png]',
            })
          }
          if (files[file].size > allowedFileSize) {
            errors.push({
              name: files[file].name,
              message:
                'Allowed file size for each file less than or equal to 2MB.',
            })
          }
        })
      }

      if (!errors?.length) {
        this.attachments = [...this.attachments, ...files]
      } else {
        this.$toast.error(
          `Unable to upload ${errors[0].name}. ${errors[0].message}`
        )
      }
      this.$refs.uploader.value = ''
    },
    onDeleteFile(idx) {
      this.attachments.splice(idx, 1)
    },

    uploadAttachment() {
      // if (!this.attachments?.length && !this.claimDetails?.id) {
      //   return this.$toast.error('Please attach a supportive document(s).')
      // }

      const formData = new FormData()

      if (this.attachments?.length) {
        for (let i = 0; i < this.attachments.length; i++) {
          formData.append('attachments', this.attachments[i])
        }
      }

      // try {

      //   alert(this.attachments.length)

      // } catch (error) {
      //   console.error(error)
      //   this.$toast.error(error?.message)
      // }
    },

    // async fetchRecentWithdrawal(accountId) {
    //   try {
    //     const result = await this.$axios.get(
    //       `/accounts/${accountId}/withdrawals?limit=1`
    //     )
    //     if (result.data.length > 0) {
    //       this.recentTransaction = result.data[0]
    //     }
    //   } catch (err) {
    //     this.$toasted.error(err.response.data.message)
    //   }
    // },
  },
}
</script>
<style scoped>
.isRequired {
  color: red;
  margin-left: 5px;
}
.ps-7 {
  color: #ffffff;
  margin-left: 2rem;
  width: 20px;
  height: 20px;
  padding-top: 1rem;
}
.ps-6 {
  margin-top: 2rem;
  margin-left: 30%;
}

.ps-1 {
  height: 100vh;
  background-color: #7165e3;
  color: #ffffff;
}
.ps-2 {
  margin-top: 2rem;
}
.ps-5 {
  color: #1c1939;
  background-color: white;
  height: 2.5rem;
  width: 20rem;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-bottom: 3rem;
}
.ps-8 {
  background: none;
  border: none;
  width: 50%;
  margin-left: -2rem;
  margin-top: 2rem;
}
.ps-4 {
  color: #7165e3;
}
.ps-9 {
  width: 6rem;
  height: 6rem;
  margin-left: 38%;
}
.ps-10 {
  margin-left: 44%;
  margin-top: 3rem;
  width: 2rem;
  height: 2rem;
  background-color: #ffffff;
  color: #1c1939;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 27px;
}
</style>
