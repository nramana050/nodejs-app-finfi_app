<template lang="pug">
div.flex.flex-col
  LeadHeader.flex(:title="`Let\'s get started!`" :lead="'Please enter your organization code sent to your registered email'")
  div.flex.flex-0.py-10
    input.shadow.appearance-none.border.rounded.w-full.py-2.px-3.uppercase(class="focus:outline-none focus:shadow-outline" placeholder="Organization code" v-model="organizationCode")
  div.flex.justify-end
    button.text-white.inline-flex.items-start(@click="validate")
      span.text-xl.tracking-wide {{ $t('proceed') }}
      outline-arrow-circle-right-icon.w-8.h-8.ml-2
</template>

<script>
export default {
  name: 'IndexPage',
  auth: false,
  data() {
    return {
      organizationCode: null,
    }
  },
  beforeMount() {
    if (this.$auth.strategy.token.status().valid()) {
      this.$router.push('/dashboard');
    }
    this.$store.commit('clear', 'organization');
  },
  methods: {
    async validate() {
      if (!this.organizationCode) {
        this.$toast.error('Provide organization code');
        return;
      }
      if(this.organizationCode) this.organizationCode = this.organizationCode.trim()
  
      if(this.organizationCode.length!==6){
        this.$toast.error('Organization code must be of 6 characters');
        return;
      }
      const organization = await this.$axios.$post(`/ext/organization`,{ code: this.organizationCode });
      const { status, code, name } = organization;
      if (!status) {
        this.$toast.error('Organization not registered');
        return;
      }
      this.$store.commit('set', { param: 'organization', value: { code, name } })
      this.$router.push('/login')
    }
  }
}
</script>
