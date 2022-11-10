<template lang="pug">
    div
      div.flex.flex-row.text-white.border.p-4.items-center.ps-1
      div.ps-2
        img(src="~/assets/unchecked.png")
      div.ps-3
        div.text-xl Transfer Failed
        div.text-sm {{message}}
      div.flex-0.fixed.bottom-0
        div.flex.flex-row.justify-between
          button.ps-4(@click="navToDasahboard") Back to Home  
          button.ps-5(@click="navToTransfer") Retry
      
</template>
<script>
export default{
    name:'TransferScreen',
    layout:'empty',
    props: {
    message: {
      type: String,
      required: true,
    },
  },
    data(){
        return{

        }
    },
    methods:{
        navToDasahboard(){
            this.$router.push('/dashboard')
        },
        navToTransfer(){
          this.$router.push('/TransferScreen')
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
.ps-4{
    color: #000000;
    background-color: white;
    height: 2.5rem;
    width: 9rem;
    margin-left: 2rem;
    margin-right: 1rem;
    margin-bottom: 3rem;
    border: 1px solid #ccc;
}
.ps-5 {
  color: white;
  background-color:#7165e3;
  height: 2.5rem;
  width: 9rem;
  margin-left: 1rem;
  margin-right: 2rem;
  margin-bottom: 3rem;
  
}
</style>