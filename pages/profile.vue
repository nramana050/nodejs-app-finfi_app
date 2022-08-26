<template lang="pug">
  div.flex.flex-col
    div.flex-0.w-96
      PageHeader(:title="'Profile'")
    div(v-if="profile")
      div.flex-0.p-4.bg-gray-100.text-center.leading-7
        div.w-24.rounded-full.mx-auto.pb-4
          img.object-cover.h-24.w-24.rounded-full(src="https://library.kissclipart.com/20190227/shw/kissclipart-patient-icon-png-clipart-computer-icons-ac058a2675899cf9.png")
        p.text-lg {{ profile.first_name }} {{ profile.last_name }}
        p {{ profile.email }}
        p {{ profile.mobile }}
        button.h-10.bg-gray-700.text-white.uppercase.text-lg.rounded-md.font-bold.my-4.tracking-wider.px-8(@click="logout") logout
      //- div.flex-0.p-4.leading-7.px-8
      //-   div.flex.flex-row.justify-between.pb-2
      //-     p Date of Birth
      //-     p.text-gray-500 {{ dob }}
      //-   div.flex.flex-row.justify-between.pb-2
      //-     p Gender
      //-     p.text-gray-500 {{ profile.gender === 'M' ? 'Male' : 'Female' }}
      div.flex-0.p-4.leading-5.mx-4.mt-4
        div.flex.flex-row.justify-between.pb-6
          p.text-md.tracking-wide.font-bold.uppercase.underline Bank Details
          p.text-right(v-if="!isEditMode" @click="enableEditMode")
            outline-pencil-alt-icon.w-5.h-5
        div.flex
          FormulateForm(v-model="bank" @submit="saveBankDetail")
            div.flex.flex-row.justify-between.pb-4
              FormulateInput.pr-3(type="text" label="IFSC Code" name="ifsc_code" :disabled="!isEditMode" validation="required")
              FormulateInput.pr-3(type="text" label="Account Number" name="account_number" :disabled="!isEditMode" validation="required")
            div.flex.flex-row.justify-between.pb-4(v-if="isEditMode")
              button.bg-red-700.w-full.h-6.rounded.text-white.mr-3(@click="cancelEdit") Cancel
              button.bg-green-700.w-full.h-6.rounded.text-white.mr-3(type="submit") Save     
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
