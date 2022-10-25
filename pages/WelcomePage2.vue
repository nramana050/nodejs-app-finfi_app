<template lang="pug">
    div.ps-5
      div.ps-1
        div.text-2xl.font-bold A card that<br>earns for You
      div.ps-2
        img.w-50.h-50(src="~/assets/image3.jpg") 
      div.ps-3
        div Get 2.5% cashback on<br>every spend you do using<br> Finfi Rupay card.
      div 
        button.ps-4.font-bold(@click="navToPage3") Skip 
   </template>
   <script>
   export default{
       name:'WelcomePage2',
       layout:'session',

       methods:{
        navToPage3(){
            this.$router.push('/WelcomePage3')
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
     
   }
   .ps-7{
    height: 4.5rem;
    width: 3rem;
    background-color: #B4ADFA;
   }
   </style>