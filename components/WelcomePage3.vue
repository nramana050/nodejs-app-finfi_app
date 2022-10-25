<template lang="pug">
    div.ps-5
      div.ps-1
        div.text-2xl.font-bold Save now <br> Buy later
      div.ps-2
        img.w-50.h-50(src="~/assets/image1.jpg")
      div.ps-3
        div Thinking of buying something<br>expensive? Save with us and <br>get upto 25% discount.
      div.flex.flex-row.justify-between(@click="navToDashboard")
        button.ps-7.font-bold.text-black Get started 
        FaIcon.mx-auto.ps-8(icon='angle-right')

   </template>
   <script>
   export default{
       name:'WelcomeScreen3',
       layout:'session',

       methods:{
        navToDashboard(){
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
    height: 17vh;
    margin: 1rem;
    text-align: center;
    color: #1C1939;
   }
   .ps-4{
    color: #7165E3;
   }
   .ps-5{
     background-color: white;
     height: 100vh;
   }
   .ps-7{
    color: #7165E3;
    margin-left: 2rem;
    margin-top: -1rem;
   }
   .ps-6{
    
   }
   .ps-8{
    color: #7165E3;
    margin-left: 1rem;
    margin-top: -0.8rem;
    
   }
   
   </style>