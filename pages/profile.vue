<template lang="pug">
  div.flex.flex-col
    div.flex-0.w-96
      PageHeader(:title="'Profile'")
    div.flex-0.p-4.bg-gray-100.text-center.leading-7(v-if="profile")
      div.w-24.rounded-full.mx-auto.pb-4
        img.object-cover.h-24.w-24.rounded-full(src="https://library.kissclipart.com/20190227/shw/kissclipart-patient-icon-png-clipart-computer-icons-ac058a2675899cf9.png")
      p.text-lg {{ profile.first_name }} {{ profile.last_name }}
      p {{ profile.email }}
      p {{ profile.mobile }}
    div.flex-0.p-4.leading-7.px-8(v-if="profile")
      div.flex.flex-row.justify-between.pb-2
        p Date of Birth
        p.text-gray-500 {{ dob }}
      div.flex.flex-row.justify-between.pb-2
        p Gender
        p.text-gray-500 {{ profile.gender === 'M' ? 'Male' : 'Female' }}
    div.flex-0.p-4.bg-gray-100.leading-5.mx-4.shadow-xl.rounded-md
      div.flex.flex-row.justify-between.pb-6
        p.text-md.tracking-wide.font-bold.uppercase.underline Bank Details
        p.text-right(v-if="!isEditMode" @click="enableEditMode")
          outline-pencil-alt-icon.w-5.h-5
      div.flex.flex-row.justify-between.pb-4
        p IFSC Code
        input.text-right.w-40.rounded.text-sm.uppercase(type="text" :disabled="!isEditMode" :class="classObject" v-model="bank.ifsc_code")
      div.flex.flex-row.justify-between.pb-4
        p Account Number
        input.text-right.w-40.rounded.text-sm(type="text" :disabled="!isEditMode" :class="classObject" v-model="bank.account_number")
      div.flex.flex-row.justify-between.pb-4(v-if="isEditMode")
        button.bg-red-700.w-full.h-6.rounded.text-white.mx-2(@click="cancelEdit") Cancel
        button.bg-green-700.w-full.h-6.rounded.text-white.mx-2(@click="saveBankDetail") Save
    div.flex-0.p-4.mt-4
      button.h-12.bg-red-700.text-white.uppercase.text-lg.w-full.rounded-md(@click="logout") logout
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

  computed: {
    classObject() {
      return {
        'bg-gray-100': !this.isEditMode
      }
    },
    dob() {
      if (!this.profile.dob) {
        return
      }
      return this.$dayjs(this.profile.dob).format('YYYY-MM-DD')
    }
  },

  methods: {
    enableEditMode() {
      this.isEditMode = true
    },
    disableEditMode() {
      this.isEditMode = false
    },
    async saveBankDetail() {
      if (!this.bank.ifsc_code || !this.bank.account_number) {
        this.$toast.error('provide valid details')
        return;
      }
      try {
        await this.$axios.post('/profile/banks', this.bank);
        this.$toast.error('Bank details updated successfully');
        this.disableEditMode();
      } catch (err) {
        this.$toast.success('failed to update account details');
      }
    },
    async getBankAccount() {
      try {
        const bankResult = await this.$axios.get('/profile/banks');
        if (bankResult.data.length > 0) {
          this.bank = bankResult.data[0];
        }
      } catch (err) {
        this.$toast.error('Failed to fetch profile');
      }
    },
    async cancelEdit() {
      await this.getBankAccount();
      this.disableEditMode();
    },
    logout() {
      this.$auth.logout();
    }
  }
}
</script>
