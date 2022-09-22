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
          //- p.text-right(v-if="!isEditMode" @click="enableEditMode")
          //-   outline-pencil-alt-icon.w-5.h-5
        div.flex.flex-row.justify-between.ps-6
          p.text-sm Account number
          p.text-sm {{this.bank.account_number}}
        div.flex.flex-row.justify-between.ps-8
          p.text-sm IFSC code 
          p.text-sm {{this.bank.ifsc_code}}
        div.flex.flex-row.justify-between.ps-10
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
    const profileResult = await this.$axios.get('/profile');
    this.profile = profileResult.data;
    await this.getBankAccount();
  },

  methods: {
    enableEditMode() {
      this.isEditMode = true
    },
    disableEditMode() {
      this.isEditMode = false
    },
    navToDashBoard(){
      this.$router.push('/dashboard')
    },
    async saveBankDetail() {
      try {
        await this.$axios.post('/profile/banks', this.bank);
        this.$toast.info('Bank details updated successfully');
        this.disableEditMode();
      } catch (err) {
        this.$toast.success('failed to update account details');
      }
    },
    async getBankAccount() {
      try {
        const bankResult = await this.$axios.get('/profile/banks');
        console.log('balaaa',bankResult.data.ifsc_code,bankResult.data.account_number)
        if (bankResult.data) {
          this.bank = bankResult.data;
        }
      } catch (err) {
        this.$toast.error('Failed to fetch profile');
      }
    },
    async cancelEdit(e) {
      e.preventDefault();
      await this.getBankAccount();
      this.disableEditMode();
    },
    logout() {
      this.$auth.strategy.token.reset();
      this.$auth.logout();
    }
  }
}
</script>
<style scoped>
  .ps-1{
    background-color: #7165E3;
    color: white;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  .ps-7{
    color: #FFFFFF;
    margin-left: 2rem;
    width: 20px;
    height: 20px;
    padding-top: 1rem;
  }
  .ps-2{
    margin-top: 1rem;
  }
  .ps-3{
    margin-top: 10px;
  }
  .ps-4{
    padding-bottom: 15px;
  }
  .ps-5{
    margin-left: 2rem;
    margin-right: 2rem;
    color: #1C1939;
  }
  .ps-6{
    margin-top: 2rem;
  }
  .ps-8{
    margin-top: 1rem;
    margin-bottom: 3rem;
  }
  .ps-9{
    color: black;
  }
  .ps-10{
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>