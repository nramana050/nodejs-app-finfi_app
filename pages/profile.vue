<template lang="pug">
  div.flex.flex-col
    div(v-if="profile")
      div.flex-0.ps-1
        button.ps-7.text-left(@click="navToDashBoard")
          FaIcon.mx-auto(icon='angle-left')
        div.w-24.rounded-full.text-center.mx-auto.ps-2
          img.object-cover.h-24.w-24.rounded-full(src="https://library.kissclipart.com/20190227/shw/kissclipart-patient-icon-png-clipart-computer-icons-ac058a2675899cf9.png")
        p.font-bold.text-xl.text-center {{ profile.first_name }} {{ profile.last_name }}
        p.text-center.text-sm.ps-3 {{ profile.email }}
        p.text-center.text-sm.ps-4 {{ profile.mobile }}
      //- button.h-10.bg-gray-700.text-white.uppercase.text-lg.rounded-md.font-bold.my-4.tracking-wider.px-8(@click="logout") logout
      //- div.flex-0.p-4.leading-7.px-8
      //-   div.flex.flex-row.justify-between.pb-2
      //-     p Date of Birth
      //-     p.text-gray-500 {{ dob }}
      //-   div.flex.flex-row.justify-between.pb-2
      //-     p Gender
      //-     p.text-gray-500 {{ profile.gender === 'M' ? 'Male' : 'Female' }}
      div.ps-5.uppercase
        div.flex.flex-row.justify-between.ps-6
          p.text-md.tracking-wide.font-bold.uppercase Bank Details
          p.text-right(v-if="!isEditMode" @click="enableEditMode")
            outline-pencil-alt-icon.w-5.h-5
        div.flex.ps-13
          FormulateForm(v-model="bank" @submit="saveBankDetail")
            div.flex.flex-row.justify-between
              span.text-sm.ps-12 Account number
              FormulateInput.ps-11(type="text" name="account_number" :disabled="!isEditMode" validation="required")
            div.flex.flex-row.justify-between
              span.text-sm.ps-12 IFSC code
              FormulateInput.ps-11(type="text" name="ifsc_code" :disabled="!isEditMode" validation="required")
            div.flex.flex-row.justify-between.pb-4.ps-13(v-if="isEditMode")
              button.bg-red-700.w-full.h-6.rounded.text-white.mr-3(@click="cancelEdit") Cancel
              button.bg-green-700.w-full.h-6.rounded.text-white.mr-3(type="submit") Save     
        //- div.flex.flex-row.justify-between.ps-6
        //-   p.text-sm Account number
        //-   FormulateInput(type="text" name="account_number" :disabled="!isEditMode" validation="required" )
        //-   //- p.text-sm(v-if="!isEditMode") {{this.bank.account_number}}
        //- div.flex.flex-row.justify-between.ps-8
        //-   p.text-sm IFSC code 
        //-   FormulateInput(type="text" name="ifsc_code" :disabled="!isEditMode" validation="required" v-model="this.bank.ifsc_code")
        //-   //- p.text-sm(v-if="!isEditMode") {{this.bank.ifsc_code}}
        //- div.flex.flex-row.justify-between.pb-4(v-if="isEditMode")
        //-   button.bg-red-700.w-full.h-6.rounded.text-white.mr-3(@click="cancelEdit") Cancel
        //-   button.bg-green-700.w-full.h-6.rounded.text-white.mr-3(type="submit" @click="saveBankDetail") Save  
        div.ps-14
          div.flex.flex-row.justify-between.ps-13
            div
              p.text-sm Change Passcode
            button(@click="")
              FaIcon.mx-auto.font-bold.w-3.h-3(icon='chevron-right')
          div.flex.flex-row.justify-between.ps-10
            p.text-sm Notification
            button(@click="")
              FaIcon.mx-auto.font-bold.w-3.h-3(icon='chevron-right') 
          div.flex.flex-row.justify-between.ps-10
            p.text-sm Logout
            button(@click="logout")
              FaIcon.mx-auto.font-bold.w-3.h-3(icon='chevron-right')
        
        //- div.flex
        //-   FormulateForm(v-model="bank" @submit="saveBankDetail")
        //-     div.flex.flex-row.justify-between.pb-4
        //-       FormulateInput(type="text" label="IFSC Code" name="ifsc_code" :disabled="!isEditMode" validation="required")
        //-       FormulateInput(type="text" label="Account Number" name="account_number" :disabled="!isEditMode" validation="required")
        //-     button.h-10.bg-gray-700.text-white.uppercase.text-lg.rounded-md.font-bold.my-4.tracking-wider.px-8(@click="logout") logout
        //-     div.flex.flex-row.justify-between.pb-4(v-if="isEditMode")
        //-       button.bg-red-700.w-full.h-6.rounded.text-white.mr-3(@click="cancelEdit") Cancel
        //-       button.bg-green-700.w-full.h-6.rounded.text-white.mr-3(type="submit") Save     
</template>

<script>
export default {
  name: 'ProfilePage',
  layout: 'session',

  data() {
    return {
      profile: null,
      bank: {
        ifsc_code: null,
        account_number: null,
      },
      isEditMode: false,
    }
  },

  async fetch() {
    const profileResult = await this.$axios.get('/profile')
    this.profile = profileResult.data
    await this.getBankAccount()
  },

  methods: {
    enableEditMode() {
      this.isEditMode = true
    },
    disableEditMode() {
      this.isEditMode = false
    },
    navToDashBoard() {
      this.$router.push('/dashboard')
    },
    async saveBankDetail() {
      try {
        await this.$axios.post('/profile/banks', this.bank)
        this.$toast.info('Bank details updated successfully')
        this.disableEditMode()
      } catch (err) {
        this.$toast.success('failed to update account details')
      }
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
    async cancelEdit(e) {
      e.preventDefault()
      await this.getBankAccount()
      this.disableEditMode()
    },
    logout() {
      this.$auth.strategy.token.reset()
      this.$auth.logout()
    },
  },
}
</script>
<style scoped>
.ps-1 {
  background-color: #7165e3;
  color: white;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
.ps-7 {
  color: #ffffff;
  margin-left: 2rem;
  width: 20px;
  height: 20px;
  padding-top: 1rem;
}
.ps-2 {
  margin-top: 1rem;
}
.ps-3 {
  margin-top: 10px;
}
.ps-4 {
  padding-bottom: 15px;
}
.ps-5 {
  margin-left: 2rem;
  margin-right: 2rem;
  color: #1c1939;
}
.ps-6 {
  margin-top: 2rem;
}
.ps-8 {
  margin-top: 1rem;
  margin-bottom: 3rem;
}
.ps-9 {
  color: black;
}
.ps-10 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
.ps-11 {
  margin-left: 1rem;
  margin-right: -1rem;
  padding-top: 10px;
}
.ps-12 {
  padding-top: 15px;
}
.ps-13 {
  margin-top: 1rem;
}
.ps-14 {
  margin-top: 3rem;
}
</style>
