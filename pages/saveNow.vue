<template lang="pug">
  div 
    div.ps-1
      div(@click="navToDashboard")
        FaIcon.mx-auto.ps-m.ps-4(icon='angle-left')
      div.font-bold.text-3xl.ps-5 Save Now Buy Later 
      div.flex.flex-row.justify-between.ps-m
        button.ps-3(@click="navToCategories")
          FaIcon.mx-auto.ps-12(icon='plus')
          p.ps-13 New plan 
        button.ps-3(@click="navToActivePlans")
          FaIcon.mx-auto.ps-12(icon='pen-to-square')
          p.ps-13 Active plans
        button.ps-3(@click="navToPastPlans")
          FaIcon.mx-auto.ps-12(icon='hourglass-half')
          p.ps-13 Past plans
    div.ps-2
      div 
        p.text-sm.underline.ps-6 View all
      div.ps-7
        div.flex.flex-row.justify-between
          FaIcon.mx-auto.ps-8(icon='apple-whole') 
          div.ps-9.font-bold Apple
        div.ps-10.text-sm Get 5% Cashback
        div.ps-11.font-bold Save now
       
          
         
       
</template>
<script>
export default {
  name: 'SaveNow',
  layout: 'session',

  methods: {
    navToDashboard() {
      this.$router.push('/dashboard')
    },
    navToActivePlans() {
      this.$router.push('/ActivePlans')
    },
    navToPastPlans() {
      this.$router.push('/PastPlans')
    },
    navToCategories() {
      this.$router.push('/categoriesScreen')
    },
  },
}
</script>
<style scoped>
.ps-1 {
  height: 40vh;
  background-color: #7165e3;
  color: white;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
.ps-m {
  margin-left: 2rem;
  margin-right: 2rem;
}
.ps-3 {
  height: 6rem;
  width: 6rem;
  background-color: white;
  color: #1c1939cc;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  text-align: center;
  border-radius: 7px;
  margin-top: 2rem;
}
.ps-4 {
  padding-top: 1rem;
}
.ps-5 {
  padding-top: 1rem;
  text-align: center;
}
.ps-2 {
  height: 60vh;
}
.ps-6 {
  margin-top: 3rem;
  margin-left: 1rem;
  color: #7165e3;
}
.ps-7 {
  width: 40%;
  height: 22vh;
  background-color: white;
  border-radius: 15px;
  margin-top: 2rem;
  box-shadow: 0px 35px 65px rgba(0, 0, 0, 0.0790811);
}
.ps-8 {
  background-color: white;
  color: black;
  padding: 15px;
}
.ps-9 {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 25px;
  padding-left: 25px;
  background-color: #7165e3;
  color: white;
}
.ps-10 {
  background-color: white;
  color: black;
  padding-top: 20px;
  padding-left: 10px;
}
.ps-11 {
  background-color: white;
  color: #7165e3;
  padding-top: 10px;
  padding-left: 10px;
}
.ps-12 {
  height: 2rem;
  width: 2rem;
  color: #7165e3;
}
.ps-13 {
  padding-top: 10px;
}
</style>
