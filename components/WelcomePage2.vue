<template lang="pug">
    div.ps-5
      div.ps-1
        div.text-2xl.font-bold A card that<br>earns for You
      div.ps-2
        img.w-50.h-50(src="~/assets/image3.jpg") 
      div.ps-3
        div Get unlimited 2.5% cashback on<br>your salary spent through<br>the Finfi Rupay card.
      div.flex.flex-row.justify-between
        button.ps-7.font-bold.text-black(@click="navToDashboard") Skip  
   </template>
<script>
export default {
  name: 'WelcomeScreen2',
  layout: 'empty',

  methods: {
    navToDashboard() {
      this.$router.push('/workforce/dashboardscreen')
    },
  },
}
</script>
<style scoped>
.ps-1 {
  color: #7165e3;
  text-align: center;
  height: 15vh;
  padding-top: 4rem;
}
.ps-2 {
  margin: 2rem;
}
.ps-3 {
  height: 20vh;
  margin: 1rem;
  text-align: center;
  color: #1c1939;
}
.ps-4 {
  color: white;
  height: 2rem;
  width: 30%;
  background-color: #7165e3;
  border-radius: 30px;
  margin-left: 8.5rem;
}
.ps-5 {
  background-color: white;
  height: 100vh;
}
.ps-6 {
}
.ps-7 {
  color: #7165e3;
  margin-left: 2rem;
  margin-top: -3rem;
}
.ps-8 {
  height: 5.5rem;
  width: 5rem;
  background-color: #b4adfa;
  border-top-left-radius: 70px;
}
</style>
