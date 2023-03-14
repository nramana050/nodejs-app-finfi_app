<template lang="pug">
  div.ps-5
    div.ps-1
      span.text-2xl.font-bold Make any day,<br>Pay day.
    div.ps-2
      img.w-50.h-50(src="~/assets/image2.jpg")
    div.ps-3
      div.text-ms Get salary from your employer <br>in real-time before the payday. <br>Not a loan, It is your earned<br> salary in your hands.
    div.flex.flex-row.justify-between
      button.ps-7.font-bold.text-black(@click="navToDashboard") Skip


</template>
<script>
export default {
  name: 'WelcomeScreen1',
  layout: 'empty',

  methods: {
    navToDashboard() {
      this.$router.push('/dashboard')
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
  border-radius: 15px;
}
.ps-3 {
  height: 18vh;
  margin: 1rem;
  text-align: center;
  color: #1c1939;
}
.ps-4 {
  color: #7165e3;
  margin: 2rem;
}
.ps-5 {
  background-color: white;
  height: 100vh;
}
.ps-6 {
  height: 8rem;
  width: 3rem;
  background-color: #b4adfa;
  border-top-right-radius: 70px;
  border-bottom-right-radius: 70px;
}

.ps-7 {
  color: #7165e3;
  margin-left: 2rem;
  margin-top: -2rem;
}
.ps-8 {
  height: 5.5rem;
  width: 5rem;
  background-color: #b4adfa;
  border-top-left-radius: 70px;
  margin-top: -1.5rem;
}
</style>
