<template lang="pug">
  div.ps-5
    div.ps-2
      img(src="~/assets/physicalcard.png") 
    div.ps-1
      div.text-2xl.font-bold Physical Card
    div.ps-3.text-ms
      div.ps-4 1.Your EWA card is issued on the Rupay network & is accepted at millions of online & offline merchants across India.
      div.ps-4 2.You earn 2.5% cashback on every purchase for the first 3 months & 1% post 3 months.
      div.ps-4 3.You get instant discounts at over 50 leading brands. 
    div.flex.flex-row.justify-between.bottom-0
      span.ps-6
      span.ps-7(@click="navToRequestCard")
        button
          span.font-bold Order now
          FaIcon.ps-8(icon='angle-right')
        
</template>
<script>
export default {
  name: 'WelcomePage4',
  layout: 'empty',

  methods: {
    navToRequestCard() {
      this.$router.push('/RequestPhysical')
    },
  },
}
</script>
<style scoped>
.ps-5 {
  background-color: white;
  height: 100vh;
}
.ps-1 {
  color: #7165e3;
  text-align: center;
}
.ps-2 {
  height: 40vh;
  width: 80%;
  margin-left: 2rem;
  margin-right: 2rem;
  padding-top: 1rem;
}
.ps-3 {
  height: auto;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 1rem;
}
.ps-4 {
  padding: 10px;
}
.ps-6 {
  height: 5.7rem;
  width: 6rem;
  border-top-right-radius: 90px;
  background-color: #b4adfa;
}
.ps-7 {
  color: #7165e3;
  margin-right: 2rem;
  margin-top: 3rem;
}
.ps-8 {
  padding-left: 5px;
}
</style>
