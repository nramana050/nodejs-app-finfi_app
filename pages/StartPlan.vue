<template lang="pug">
    div
      div.flex.flex-row.text-white.border.p-4.items-center.ps-13
        button(@click="navToProductScreen")
          FaIcon.mx-auto.ps-12(icon='angle-left')
        h3.text-sm.font-bold.tracking-widest.uppercase {{this.selecteProduct.product_name}}'s saving plan
      div.ps-2
        div.ps-4.flex.flex-row.justify-between
          div.relative.pt-1
            div.flex.flex-row.justify-between
              span.ps-7 Your Goal amount
              span.ps-15 &#8377;
              input.ps-14(class="focus:outline-none focus:shadow-outline" type="numeric" v-model="slidervalue1")
            //- span.ps-9 &#8377; {{slidervalue1}}
            input#customRange1.form-range.w-full.h-6.p-0.bg-transparent(type='range' class='focus:outline-none focus:ring-0 focus:shadow-none' min="1000" max="100000" v-model="slidervalue1")
        div.ps-4.flex.flex-row.justify-between
          div.relative.pt-1
            span.ps-7 Duration
            span.ps-10 {{slidervalue2}} Months
            input#customRange1.form-range.w-full.h-6.p-0.bg-transparent(type='range' class='focus:outline-none focus:ring-0 focus:shadow-none' min="1" max="12" v-model="slidervalue2")
        div.ps-5 Your Deposit &#8377; {{monthlyDeposit}} monthly <br> will be deducted from your Salary
        div.ps-3
          div.ps-4.flex.flex-row.justify-between
            span.font-bold You deposit
            span.font-bold You get
          div.ps-4.flex.flex-row.justify-between
            span.ps-12 &#8377; {{slidervalue1}}
            span.ps-12 &#8377; {{getAmount}}
      div.ps-6
        div.font-bold.text-xl.text-center How the plan works
        div.ps-7 1. On completing your goal, You will get a voucher worth &#8377; {{getAmount}} 
        div.ps-7 2. The voucher is applicable on all online stores
      div.ps-7(@click="createOrder" v-if="!slidervalue1==0 && !slidervalue2==0")
        button.ps-8.font-bold Start My Plan
        


</template>
<script>
import moment from 'moment'

export default {
  name: 'StartPlans',
  layout: 'session',
  data() {
    return {
      Orders: [],
      goal_amount: '',
      slidervalue1: 0,
      slidervalue2: 1,
      getAmount: 0,
      monthlyDeposit: 0,
      currentDate: null,
      completeDate: null,
      data: '',
      discount:0,
    }
  },
  computed: {
    selecteProduct() {
      return this.$store.state.snbl.product
    },
  },
  mounted() {
    const _this = this
    this.discount=this.selecteProduct.merchant_discount
    console.log('productDetails',this.discount)
    setInterval(function () {
      const today = moment()
      _this.currentDate = today.format('YYYY-MM-DD')
      const monthsLeft = today.add(_this.slidervalue2, 'months')
      _this.completeDate = monthsLeft.format('YYYY-MM-DD')
      _this.goal_amount = _this.slidervalue1
      _this.monthlyDeposit = parseFloat(_this.slidervalue1 / _this.slidervalue2).toFixed(2)
      _this.getAmount = parseFloat(_this.slidervalue1 * _this.discount/100).toFixed(0)
    }, 1000)
  },
  methods: {
    navToProductScreen() {
      this.$router.push('/MerchantScreen')
    },
    async createOrder() {
      if(this.slidervalue1===0)
      {
        this.$toast.error('Set the Goal amount')
        return
      }
      if(this.slidervalue2===0)
      {
        this.$toast.error('Set months for Goal amount')
        return
      }
      const payload = {
        product_id: this.selecteProduct.id,
        account_type: 'CARD',
        goal_amount: this.slidervalue1,
        frequency: 'monthly',
        status: 'ACTIVE',
        start_date: this.currentDate,
        end_date: this.completeDate,
      }
      try{
      await this.$axios.$post(`/snbl/order`, payload).then((result) => {
        this.data = result.data
      })
      this.$toast.info('Your Plan started successfully')
        this.$router.push('/ActivePlans')
    }catch (err) {
        this.$toast.error('Failed to start plan')
      }
    },
  },
}
</script>
<style scoped>
.ps-2 {
  margin: 1.5rem;
  background-color: white;
  color: #1c1939;
  height: 48vh;
  box-shadow: 0px 30px 60px rgba(0, 0, 0, 0.0790811);
}
.ps-3 {
  margin: 1rem;
  background-color: #7165e3;
  color: white;
  border-radius: 5px;
}
.ps-4 {
  margin: 0.5rem;
  margin-top: 1rem;
}
.ps-5 {
  text-align: center;
}
.ps-6 {
  margin: 1.5rem;
  background-color: white;
  color: #1c1939;
  height: 25vh;
  box-shadow: 0px 30px 60px rgba(0, 0, 0, 0.0790811);
}
.ps-7 {
  margin: 10px;
}
.ps-8 {
  width: 90%;
  margin: 1rem;
  background-color: #7165e3;
  color: white;
  padding: 12px;
  border-radius: 10px;
  margin-top: -2rem;
}
.ps-9 {
  margin-left: 5rem;
}
.ps-10 {
  margin-left: 9rem;
}
.ps-11 {
  margin: 15px;
  text-align: center;
}
.ps-12 {
  margin-left: 1rem;
  margin-right: 1rem;
  color: white;
}
.ps-13 {
  background-color: #7165e3;
}
.ps-14{
  width: 25%;
}
.ps-15{
  margin-top: 10px;
  margin-left: 4rem;
}
</style>
