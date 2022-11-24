<template lang="pug">
  div.ps-5
    div.ps-2
     button(@click="navToDashboard")
      FaIcon.mx-auto.ps-9(icon='angle-left')
      img.ps-7(src="~/assets/paymentsuccesfull.png") 
    div.ps-3.text-ms
      div.ps-4 Thank You Your Physical card is ordered successfully. It will take 15 days to deliver your Card


        
</template>
<script>
   export default{
    name:'WelcomePage4',
    layout:'empty',

    methods:{
      navToDashboard() {
        this.$router.push('/Dashboard')
      },
    }
   }
</script>
<style scoped>
  .ps-5{
      padding:10px;
   }
   .ps-2{
     height: 40vh;
     width: 80%;
     margin-left: 2rem;
     margin-right: 2rem;
     padding-top: 1rem;
   }
   .ps-3{
    height: auto;
    padding-left:2rem;
    padding-right: 2rem;
    padding-top: 1rem;
   }
   .ps-4{
    padding:45px
   }
   .ps-9{
    margin-left: 1rem;
    margin-right: 16rem;
    margin-top: 12px;
    color: black;
   }
   .ps-7 {
    max-width: 83%;
    height: auto;
    margin: auto;
    padding: 1rem;
    margin-top: 2rem;
   }
</style>