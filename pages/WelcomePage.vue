<template lang="pug">
  div.ps-1
    ssr-carousel( :show-dots="true")
      div.slide 
        WelcomePage1
      div.slide
        WelcomePage2
      div.slide
        WelcomePage3
    div.flex.flex-row.justify-between
      span
      span.ps-8
    
    
</template>
<script>
   export default{
       name:'WelcomePage',
       layout:'session',
       data() {
       return {
        }
       },
      
      //  setup(){
      //   return{
      //     modules:[pagination]
      //   };
      //  },
      methods:{
        // navToPage2(){
        //   this.$router.push('/WelcomePage2')
        // }
       }
    }
   </script>
   <style scoped>
   .slide {
    height: 85vh;
   }
   .ps-1{
    background-color: white;
    height: 100vh;
   }
  .ps-2{
    background-color: white;
    color: #7165E3;
    margin-top: -1.5rem;
    margin-left: 2rem;
  }
  .ps-3{
    height: 5.5rem;
    width: 5rem;
    background-color: #7165E3;
    border-top-left-radius: 70px;
  }
  .ps-4{
    margin-top: -4rem;
  }
  .ps-7{
    color: #7165E3;
    margin-left: 2rem;
    margin-top: -5rem;
  }
  .ps-8{
    height: 5.5rem;
    width: 5rem;
    background-color: #B4ADFA;
    border-top-left-radius: 70px;
    margin-top: -1.5rem;
   }
   </style>