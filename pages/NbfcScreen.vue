<!-- <template lang="pug">
    div.ps-0.shop-container
      div.flex-0 
        PageHeader.font-bold(:title="'Check Your Credit Limit'")
        div.main-container.w-full
            //- iframe.ifgh.w-full.h-screen(:src="webJournyUrl",allow="geolocation; camera; microphone")
  </template> -->

<template>
  <div class="flex flex-col justify-center items-center mt-5">
    <h2 class="font-light justify-center items-center text-2xl my-2">
      Check Your Credit Limit
    </h2>
    <div class="main-container w-full">
      <p class="text-center text-xl px-0.5">
        You will be redirected to RR Fincap website to check your credit limit.
      </p>
      <div class="my-5">
        <button
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mx-1 my-1 rounded"
          @click="popupNav"
        >
          Click here to continue
        </button>
        <button
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 my-1 rounded"
          @click="navToDashboard"
        >
          Click here to go back
        </button>
      </div>
    </div>
  </div>
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

  // mounted(){
  //   this.reloadIframe()
  // },

  methods: {
    reloadIframe() {
      const iframe = document.getElementsByClassName('ifgh')[0]
      iframe.src = this.$store.state.web_journey_url
    },
    webJournyUrl() {
      return this.$store.state.web_journey_url
    },
    popupNav() {
      window.open(
        this.$store.state.web_journey_url,
        'Popup',
        'width=400,height=300'
      )
    },
    navToDashboard() {
      this.$router.push('/workforce/dashboardscreen')
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
