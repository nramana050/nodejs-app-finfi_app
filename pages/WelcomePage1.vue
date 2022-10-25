<template lang="pug">
    div.ps-5
      div.ps-1
        div.text-2xl.font-bold Make any day,
        div.text-2xl.font-bold Pay day.
      div.ps-2
        img.w-50.h-50(src="~/assets/image2.jpg")
      div.ps-3
        div.text-ms Get what you have already<br>  earned on demand before <br>your pay day. No Loans-Your <br>money, In Your hand's.
      div.ps-6
        button.ps-4.font-bold(@click="navToPage2") Skip 
      //- div.ps-6 
      //-   button.flex.flex-row.justify-between
      //-     span.ps-4.font-bold Skip
      //-     span.ps-7
   </template>
   <script>
   export default{
       name:'WelcomePage1',
       layout:'session',

    methods:{
       navToPage2(){
        this.$router.push('/WelcomePage2')
       }
    }


   }
   </script>
   <style scoped>
   .ps-1{
     color: #7165E3;
     text-align: center;
     height: 15vh;
     padding-top: 4rem;
   }
   .ps-2{
    margin: 2rem;
    border-radius: 15px;
   }
   .ps-3{
    height: 20vh;
    margin: 1rem;
    text-align: center;
    color: #1C1939;
   }
   .ps-4{
    color: white;
    height: 2rem;
    width: 30%;
    background-color: #7165E3;
    border-radius: 30px;
    margin-left: 8.5rem;
   }
   .ps-5{
     background-color: white;
     height: 100vh;
   }
   .ps-6{
     align-items: right;
   }
   .ps-7{
    height: 4.5rem;
    width: 3rem;
    background-color: #B4ADFA;
   }
   </style>