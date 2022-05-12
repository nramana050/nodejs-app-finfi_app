<template lang="pug">
  div.flex.flex-col
    LeadHeader.flex(:title="`Hello ${user.first_name},`" :lead="'Set 6 digit login passcode. You can also set it later under profile menu.'")
    div.flex.flex-col.py-12
      input.shadow.appearance-none.border.rounded.w-full.py-2.px-3(class="focus:outline-none focus:shadow-outline" placeholder="Passcode" v-model="passcode")
      input.shadow.appearance-none.border.rounded.w-full.py-2.px-3.my-4(class="focus:outline-none focus:shadow-outline" placeholder="Confirm passcode" v-model="passcode_2")
    div.flex.flex-1.justify-between.py-8
      p.text-sm.text-white.underline(@click="navToDashboard") Skip to Dashboard
      button.text-white.inline-flex.items-start(@click="set")
        span.text-xl.tracking-wide Set
        outline-arrow-circle-right-icon.w-8.h-8.ml-2
      
</template>

<script>
export default {
  name: 'PasscodePage',
  data() {
    return {
      user: this.$auth.user,
      passcode: null,
      passcode_2: null,
      hasError: false,
    }
  },
  methods: {
    async set() {
      try {
        if (Number(this.passcode) !== Number(this.passcode_2)) {
          this.$toast.error('Passcode not matched');
          return;
        }
        await this.$axios.$post('/profile/passcode', { passcode: Number(this.passcode) }); 
        this.$toast.success('Passcode set successfully');
        setTimeout(() => this.navToDashboard() , 2000);
      } catch (err) {
        this.hasError = true;
        this.$toast.error('Failed');
      }
    },
    navToDashboard() {
      this.$router.push('/dashboard')
    }
  },
}
</script>
