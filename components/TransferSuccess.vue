<template lang="pug">
    div
      div.flex.flex-row.text-white.border.p-4.items-center.ps-1
      div.ps-2
        img(src="~/assets/checked.png")
      div.ps-3
        div.text-xl Congratulations!
        div.text-sm Your transaction is successfull
      div.ps-3
        div.text-sm Your amount will be credited <br>to your account within 1 working day.
      div.flex-0.fixed.bottom-0
        button.btn.h-8.px-4.text-white.rounded.font-bold.ps-5(@click="navToDasahboard") Back to Home
      
</template>
<script>
export default{
    name:'TransferScreen',
    layout:'empty',
    data(){
        return{

        }
    },
    methods:{
        navToDasahboard(){
            this.$router.push('/dashboard')
        }
    }
}
</script>
<style scoped>
.ps-1{
    background-color: #7165e3;
    height: 3rem;
}
.ps-2{
    height: 8rem;
    width: 8rem;
    margin-top: 8rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.ps-3{
    text-align: center;
    color: #000000;
    margin: 2rem;
}
.ps-5 {
  color: #1C1939;
  background-color: white;
  height: 2.5rem;
  width: 20rem;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-bottom: 3rem;
  border: 1px solid #ccc;
}
</style>