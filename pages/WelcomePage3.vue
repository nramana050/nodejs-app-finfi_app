<template lang="pug">
    div.ps-5
      div.ps-1
        div.text-2xl.font-bold Save now <br> Buy later
      div.ps-2
        img.w-50.h-50(src="~/assets/image1.jpg")
      div.ps-3
        div Thinking of buying an<br>expensive branded gadgets?<br>Save with us first, Get upto<br> 25% discount by the brands.
      div
        button.ps-4.font-bold(@click="navToDashBoard") Get Started

   </template>
   <script>
   export default{
       name:'WelcomePage3',
       layout:'session',

       methods:{
        navToDashBoard(){
            this.$router.push('/dashboard')
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
    background-image: 'image1.jpg'
   }
   .ps-3{
    height: 22vh;
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
   .ps-7{
    height: 4.5rem;
    width: 3rem;
    background-color:#B4ADFA;
   }
   .ps-6{
    background-color: #B4ADFA;
    color: white;
    height: 4.5rem;
    text-align: center;
    border-top-left-radius: 80px;
    border-top-right-radius: 80px;
   }

   </style>