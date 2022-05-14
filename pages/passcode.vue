<template lang="pug">
  div.flex.flex-col
    LeadHeader.flex(:title="`Hello ${user.first_name},`" :lead="'Set 6 digit login passcode. You can also set it later under profile menu.'")
    div.flex.flex-col.py-12
      input.shadow.appearance-none.border.rounded.w-full.py-2.px-3(class="focus:outline-none focus:shadow-outline" placeholder="Enter 6 digit passcode" type="number" v-model="passcode_1")
      input.shadow.appearance-none.border.rounded.w-full.py-2.px-3.my-4(class="focus:outline-none focus:shadow-outline" placeholder="Confirm passcode" type="number" v-model="passcode_2")
    div.flex.flex-1.justify-between.py-8
      p.text-sm.text-white.underline(@click="navToDashboard") Skip to Dashboard
      button.text-white.inline-flex.items-start(@click="setPasscode")
        span.text-xl.tracking-wide Set
        outline-arrow-circle-right-icon.w-8.h-8.ml-2
      
</template>

<script>
export default {
  name: 'PasscodePage',
  data() {
    return {
      user: this.$auth.user,
      passcode_1: null,
      passcode_2: null,
      hasError: false,
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
        this.navToDashboard();
      } catch (err) {
        this.$toast.error('failed to update passcode');
      }
    },
    navToDashboard() {
      this.$router.push('/dashboard')
    }
  },
}
</script>
