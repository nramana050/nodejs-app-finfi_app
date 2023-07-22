<template lang="pug">  
div
  div(v-if="isLoading")
    SplashScreen.ps-6(v-on:splash="fromSplashScreen")
  div(v-if="!isLoading")
    div.ps-7
      div.flex.flex-row.text-white.border.p-4.items-center.ps-8
      div.ps-1
        LeadHeader.font-bold.text-3xl(:title="`Let\'s get started!`" )
      div.ps-2
        LeadHeader(:lead="'Enter your organization code'")
      div
        input.ps-4(class="focus:outline-none focus:shadow-outline" placeholder="Code" v-model="organizationCode")
      div.flex-0.fixed.bottom-0
        button.btn.h-8.px-4.text-white.rounded.font-bold.ps-5(@click="validate")
          span {{ $t('proceed') }}
      
</template>

<script>
import SplashScreen from '~/components/SplashScreen.vue'
import FooterLogo from '~/components/FooterLogo.vue'
export default {
  name: 'IndexPage',
  components: { SplashScreen, FooterLogo },
  layout: 'empty',
  auth: false,
  data() {
    return {
      organizationCode: null,
      isLoading: true,
    }
  },
  watch: {
    organizationCode(newValue) {
      this.organizationCode = newValue.toUpperCase()
    },
  },
  beforeMount() {
    if (this.$auth.loggedIn && this.$auth.strategy.token.status().valid()) {
      // Vikas:July22:shortcut: move to WFM dashboard
      this.$router.push('/workforce/dashboardscreen')
      // this.$router.push('/workforce/dashboardscreen')
    }
    else{
      this.$router.push('/login')
    }
    this.$store.commit('clear', 'organization')
  },
  methods: {
    async validate() {
      if (!this.organizationCode) {
        this.$toast.error('Provide organization code')
        return
      }
      if (this.organizationCode)
        this.organizationCode = this.organizationCode.trim()
      if (this.organizationCode.length !== 6) {
        this.$toast.error('Organization code must be of 6 characters')
        return
      }
      const organization = await this.$axios.$post(`/ext/organization`, {
        code: this.organizationCode,
      })
      
      const { status, code, name } = organization
      if (!status) {
        this.$toast.error('Organization not registered')
        return
      }
      this.$store.commit('set', {
        param: 'organization',
        value: { code, name },
      })
      this.$router.push('/login')
    },
    fromSplashScreen() {
      this.isLoading = false
    },
  },
}
</script>
<style scoped>
.ps-1 {
  color: #37202b;
  margin-left: 5.5rem;
  margin-top: 3rem;
  line-height: 52px;
  letter-spacing: -2px;
}
.ps-2 {
  color: #1c1939cc;
  margin-top: 2.5rem;
  font-weight: 400;
  margin-left: 3rem;
  margin-right: 3rem;
}
.ps-3 {
  color: #1c1939cc;
  font-weight: 400;
  margin-left: 3rem;
  margin-right: 3rem;
}
.ps-4 {
  margin-left: 3rem;
  margin-top: 1rem;
  padding-left: 10px;
  padding-right: 4.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid #ccc;
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
  height: 100vh;
  background-color: #7165e3;
  color: white;
  text-align: center;
  margin-left: 0;
  margin-top: 0;
}
.ps-7 {
  height: 100vh;
  background-color: white;
}
.ps-8 {
  background-color: #7165e3;
  height: 3rem;
}
.ps-9 {
  width: 9rem;
  height: 9rem;
  margin-left: 32%;
  padding-top: 1rem;
}
</style>
