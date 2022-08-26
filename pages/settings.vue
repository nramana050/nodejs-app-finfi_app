<template lang="pug">
  div.flex.flex-col
    div.flex-0.w-96
      PageHeader(:title="'Settings'")
    div.flex-0.p-4.leading-7
      p.text-md.text-lg.pb-5 Set Passcode
      input.w-full.rounded.border.h-10.px-4.mb-4(type="number" v-model="passcode_1" placeholder="Enter 6 digit numbers")
      input.w-full.rounded.border.h-10.px-4.mb-8(type="number" v-model="passcode_2" placeholder="Confirm passcode")
      button.h-8.bg-primary.text-white.uppercase.w-full.rounded-md.font-bold(@click="setPasscode") Update
    div.flex-0.p-4.mt-24
      p.text-md.text-lg.pb-5 Are you sure to logout ?
      button.h-12.bg-red-700.text-white.uppercase.text-lg.w-full.rounded-md.font-bold(@click="logout") logout
</template>

<script>
export default {
  name: 'SettingsPage',
  layout: 'session',

  data() {
    return {
      passcode_1: '',
      passcode_2: '',
    }
  },

  methods: {
    async setPasscode() {
      if (this.passcode_1.length !== 6 || this.passcode_2.length !== 6) {
        this.$toast.error('Enter 6 digit passcode');
        return;
      }
      if (this.passcode_1 !== this.passcode_2) {
        this.$toast.error('passcode didnot match');
        return;
      }
      try {
        await this.$axios.post('/profile/passcode', {
          passcode: Number(this.passcode_1),
        });
        this.$toast.info('Passcode updated successfully');
      } catch (err) {
        this.$toast.error('failed to update passcode');
      }
    },
    logout() {
      this.$auth.strategy.token.reset();
      this.$auth.logout();
    }
  }
}
</script>
