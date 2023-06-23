<template lang="pug">
    div.ps-0.shop-container
      div.flex-0 
        PageHeader.font-bold(:title="'Check Your Credit Limit'")
        div.main-container.w-full
            iframe.ifgh.w-full.h-screen(:src="webJournyUrl",allow="geolocation; camera; microphone")

  </template>

<script>
export default {
  name: 'NbfcScreen',
  layout: 'session',
  data() {
    return {
      // webJournyUrl:"https://rrfincap.tech/authenicate/web/user?access_token=66s8Y80zTXva3kQB3SB4cEVB6PFB6UsITmYPn5jtSO6"
    }
  },

 

  computed: {
    webJournyUrl() {
      // alert(this.$store.state.web_journey_url)
      // alert(this.$store.state.web_journey_url)
      return this.$store.state.web_journey_url
      // return "https://rrfincap.tech/authenicate/web/user?access_token=66s8Y80zTXva3kQB3SB4cEVB6PFB6UsITmYPn5jtSO6"
    },
  },

  // mounted(){
  //   this.reloadIframe()
  // },

  methods: {
    reloadIframe() {
      const iframe = document.getElementsByClassName('ifgh')[0]
      iframe.src =this.$store.state.web_journey_url
    },
  },


}
</script>

<style scoped>
.main-container {
  background: #f5f5f5;
  min-height: 100vh;
}
/* component h-i-w */
</style>
