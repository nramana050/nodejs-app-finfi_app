<template lang="pug">
  div
    div.flex.flex-row-justify-between
      span.ps-6(v-for="name in History" :key="History.id"
       @click="selectedHistory(name.name,name.condition)"
       :class="[selectedValue==name.name ? 'bg-blue-600' : 'bg-white']")
        button {{name.name}}
    div
      div(v-if="selectedCondition==='none'")
        div.ps-2(v-for="transaction in transactions" @click="selectedTransaction(transaction.id)")
          div.flex.flex-row.justify-between.ps-4
            span
              p.text-sm {{ transaction.comments }}      
            span(:class="[ transaction.type==='CREDIT' ? 'text-green-700' :'text-red-700' ]")
              p.text-md.font-bold {{ transaction.type==='CREDIT'  ? '+' :  '-' }} {{ parseFloat(transaction.transaction_amount).toLocaleString() }}
          div.ps-3(v-if="selectedOption==transaction.id && show")
            div.text-sm.uppercase(:class="[ transaction.type==='CREDIT' ? 'text-green-700' :'text-red-700' ]") {{transaction.type}}ed On
            div.text-sm  Date & Time :{{date}}
      div(v-if="selectedCondition==='isCredit'")
        div.ps-2(v-for="transaction in creditListx" @click="selectedTransaction(transaction.id)")
          div.flex.flex-row.justify-between.ps-4
            span
              p.text-sm {{ transaction.comments }}      
            span(:class="[ transaction.type==='CREDIT' ? 'text-green-700' :'text-red-700' ]")
              p.text-md.font-bold {{ transaction.type==='CREDIT'  ? '+' :  '-' }} {{ parseFloat(transaction.transaction_amount).toLocaleString() }}
          div.ps-3(v-if="selectedOption==transaction.id && show")
            div.text-sm.uppercase(:class="[ transaction.type==='CREDIT' ? 'text-green-700' :'text-red-700' ]") {{transaction.type}}ed On
            div.text-sm Date & Time : {{date}}
      div(v-if="selectedCondition==='isDebit'")  
        div.ps-2(v-for="transaction in debitListx" @click="selectedTransaction(transaction.id)")
          div.flex.flex-row.justify-between.ps-4
            span
              p.text-sm {{ transaction.comments }}      
            span(:class="[ transaction.type==='CREDIT' ? 'text-green-700' :'text-red-700' ]")
              p.text-md.font-bold {{ transaction.type==='CREDIT'  ? '+' :  '-' }} {{ parseFloat(transaction.transaction_amount).toLocaleString() }}
          div.ps-3(v-if="selectedOption==transaction.id && show")
            div.text-sm.uppercase(:class="[ transaction.type==='CREDIT' ? 'text-green-700' :'text-red-700' ]") {{transaction.type}}ed On
            div.text-sm Date & Time : {{date}}

</template>

<script>

export default {
  props:['transactions'],
  data(){
    return{
      History:[
        {
          name:'All',
          id:'01',
          condition:'none'
        },
        {
          name:'Credit',
          id:'02',
          condition:'isCredit'
        },
        {
          name:'Debit',
          id:'03',
          condition:'isDebit'
        }
      ],
      selectHistory:[],
      selectedValue:'All',
      selected:false,
      selectedCondition:'none',
      none:true,
      creditList:[],
      debitList:[],
      selectedOption:'',
      show:false
    }
  },

  computed: {
    creditListx() {
      return this.transactions.filter(x=> x.type === 'CREDIT')
    },
    debitListx() {
      return this.transactions.filter(x=> x.type === 'DEBIT')
    },
    date() {
      return this.$dayjs(this.transactions.transaction_time).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    },
  },
  methods:{
    selectedHistory(name,condition){
         this.selectHistory = []
         this.selectedCondition=condition
         this.selectHistory.push(name)
         this.selected = true
         this.selectedValue=name
      },
      selectedTransaction(transaction){
        this.selectedOption=transaction
        this.show=true
      }
  }
}
</script>
<style scoped>
.ps-2 {
  height: auto;
    width:90%;
    background-color: #F2F2F2;
    border-radius: 10px;
    color: #1C1939;
    margin: 1rem;  
}
.ps-1{
  background-color: #F5F5F5;
}
.ps-3{
  color: #1C1939;
  background-color: #FFFFFF;
  padding: 15px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  text-align: center;
  /* box-shadow: 0px 35px 65px rgba(0, 0, 0, 0.0790811); */
  border: 1px solid #ccc;
}
.ps-4{
  padding: 20px;
}
.ps-6{
  width: 33.3%;
  text-align: center;
  margin-top: 1rem;
  border-bottom: 1px solid #D8D8D8;
  color: #D8D8D8;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
</style>
