<template lang="pug">
  div.ps-1
    div.text-center.ps-2
      span.text-2xl.ps-2.font-bold WELCOME TO MYFINFI!
    div
      nuxt-img.ps-6(preload src="/finfi.png" width="140" height="140") 
    div.text-center.ps-2
      span.text-2xl Now get paid everyday!
    div.text-left.ps-5
      span.text-ms Track your earned wages as available balance 
    div.flex.flex-row.mt-4.text-ms.items-left.shadow.ps-3
      div.ps-4 1) Transfer the cash limit to your salary account
    div.flex.flex-row.mt-4.text-ms.items-left.shadow.ps-7
      div.ps-4 2) Use your card limit and get 2.5% as cashback
    div.text-center.ps-8
      button(@click="navToDashBoard") Get started
    //- div.text-center.ps-2
    //-   span.text-2xl.font-bold.underline Now get paid everyday!
    //- div.text-left.ps-5
    //-   span.text-ms.font-bold Track your earned wages as available balance 
    //- div.text-left.ps-3
    //-   span.text-ms 1) Transfer the cash limit to your <br> salary account at zero fee 
    //- div.text-left.ps-4
    //-   span.text-ms 2) Use your card limit and <br> get 2.5% as cashback
    
</template>
<script>
export default {
  name: 'WelcomeScreen',
  layout: 'session',
  methods: {
    navToDashBoard() {
      this.$router.push('/dashboard')
    },
  },
}
</script>
<style scoped>
.ps-1 {
  color: #1c1939cc;
  height: 100vh;
}
.ps-2 {
  margin: 1rem;
}
.ps-3 {
  text-align: center;
  background-color: #2d4a94;
  height: 15vh;
  margin: 1.5rem;
  border-radius: 15px;
  padding: 10px;
  color: white;
}

.ps-5 {
  margin-top: 1rem;
  margin-left: 2rem;
  margin-right: 2rem;
}
.ps-6 {
  margin-left: 33%;
}
.ps-7 {
  text-align: center;
  background-color: #7165e3;
  height: 15vh;
  margin: 1.5rem;
  border-radius: 15px;
  padding: 10px;
  color: white;
}
.ps-8 {
  height: 5vh;
  width: 80%;
  margin-left: 2rem;
  margin-right: 2rem;
  color: white;
  background-color: #1c1939;
  text-align: center;
  border-radius: 8px;
  padding-top: 5px;
}
</style>
