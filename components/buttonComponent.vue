<template lang="pug">
    div.flex-0.bottom-0(v-if="!isUserRegistered")
      button.btn.h-8.px-4.text-white.rounded.font-bold.ps-5(@click="validate") {{buttonName}}
</template>
<script>
  export default{
    props:{
      buttonName:{
        type: String,
        required: true,
      }
     }
   }
</script>
<style scoped>
  .ps-5{
    color: white;
    background-color: #7165e3;
    height: 2.5rem;
    width: 20rem;
    margin-left: 2rem;
    margin-right: 2rem;
    margin-bottom: 2rem;

  }
</style>