<template lang="pug">
    div
      div.flex.flex-row.text-white.border.p-4.items-center.ps-13
        button(@click="navToProductScreen")
          FaIcon.mx-auto.ps-12(icon='angle-left')
        h3.text-sm.font-bold.tracking-widest.uppercase {{this.selecteProduct.product_name}}'s saving plan
      div.flex.flex-row
        span.ps-2-tab(v-for="name in items" :key="items.id"
        @click="selectedItem(name.name)"
        :class="[itemSelected==name.name ? 'bg-blue-600' : 'bg-white']")
          button {{name.name}}   
      div(v-if="itemSelected=='Buy Later'")  
        div.ps-2
          div.ps-4.flex.flex-row.justify-between
            div.relative.pt-1
              div.flex.flex-row.justify-between
                span.ps-7 Your Goal amount
                span.ps-15 &#8377;
                input.ps-14(class="focus:outline-none focus:shadow-outline" type="numeric" maxlength="6" max="100000" v-model="slidervalue1" @keydown="nameKeydown($event)")
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
      div(v-if="itemSelected=='Buy Now'") 
        div.ps-2
          div.ps-4.flex.flex-row.justify-between
            div.relative.pt-1
              div.flex.flex-row.justify-between
                span.ps-7 Voucher Amount
                span.ps-15 &#8377;
                input.ps-14(class="focus:outline-none focus:shadow-outline" type="numeric" maxlength="6" max="100000" v-model="slidervalue3" @keydown="nameKeydown($event)")
              input#customRange1.form-range.w-full.h-6.p-0.bg-transparent(type='range' class='focus:outline-none focus:ring-0 focus:shadow-none' min="1000" max="100000" v-model="slidervalue3")
              div.ps-5 &#8377; {{instantPayment}} will be deducted from your Salary.
              div.ps-5 Voucher Purchase T&Cs
                div.ps-3
                  div.ps-4.flex.flex-row.justify-between
                    span.font-bold You deposit
                    span.font-bold You get
                  div.ps-4.flex.flex-row.justify-between
                    span.ps-12 &#8377; {{slidervalue3}}
                    span.ps-12 &#8377; {{getMerchDis}}
        div.ps-6
          div.font-bold.text-xl.text-center How to use the vouchers
          div.ps-7 1.Vouchers will be delivered to your registered mobile number & registered email address. 
          div.ps-7 2.Discount amount will be transferred to your bank account within 3 working days.
          div.ps-7(@click="buyNow" v-if="!slidervalue3==0")
            button.ps-8.font-bold Buy Now          

</template>
<script>
import moment from 'moment'

export default {
  name: 'StartPlans',
  layout: 'empty',
  data() {
    return {
      Orders: [],
      goal_amount: '',
      slidervalue1: 0,
      slidervalue2: 1,
      slidervalue3: 0,
      getAmount: 0,
      getMerchDis: 0,
      monthlyDeposit: 0,
      instantPayment: 0,
      currentDate: null,
      completeDate: null,
      data: '',
      buyData: '',
      discount: 0,
      items: [
        {
          id: '01',
          name: 'Buy Later',
        },
        {
          id: '02',
          name: 'Buy Now',
        },
      ],
      itemSelected: 'Buy Later',
    }
  },
  computed: {
    selecteProduct() {
      return this.$store.state.snbl.product
    },
  },
  mounted() {
    const _this = this
    this.discount = this.selecteProduct.merchant_discount
    setInterval(function () {
      const today = moment()
      _this.currentDate = today.format('YYYY-MM-DD')
      const monthsLeft = today.add(_this.slidervalue2, 'months')
      _this.completeDate = monthsLeft.format('YYYY-MM-DD')
      _this.goal_amount = _this.slidervalue1
      _this.monthlyDeposit = parseFloat(
        _this.slidervalue1 / _this.slidervalue2
      ).toFixed(0)
      _this.getAmount = parseFloat(
        (_this.slidervalue1 * _this.discount) / 100
      ).toFixed(0)
      _this.instantPayment = parseFloat(_this.slidervalue3).toFixed(0)
      _this.getMerchDis = parseFloat(
        (_this.slidervalue3 * _this.discount) / 100
      ).toFixed(0)
    }, 1000)
  },
  methods: {
    selectedItem(name) {
      this.itemSelected = []
      this.itemSelected.push(name)
    },
    navToProductScreen() {
      this.$router.push('/SaveNow')
    },
    nameKeydown(e) {
      if (/^\W$/.test(e.key)) {
        e.preventDefault()
      }
    },
    async createOrder() {
      const payload = {
        product_id: this.selecteProduct.id,
        account_type: 'CARD',
        goal_amount: this.slidervalue1,
        frequency: 'monthly',
        status: 'ACTIVE',
        start_date: this.currentDate,
        end_date: this.completeDate,
      }
      try {
        if (this.slidervalue1 >= 1000) {
          if (this.slidervalue1 <= 100000) {
            await this.$axios.$post(`/snbl/order`, payload).then((result) => {
              this.data = result.data
            })
            this.$toast.info('Your Plan started successfully')
            this.$router.push('/SaveNow')
          } else {
            this.$toast.error('Maximum Goal amount is 100000')
          }
        } else {
          this.$toast.error('Minimum Goal amount is 1000')
        }
      } catch (err) {
        this.$toast.error('Failed to start plan')
      }
    },
    async buyNow() {
      const payload = {
        product_id: this.selecteProduct.id,
        amount: parseInt(this.instantPayment),
      }
      try {
        const res = await this.$axios.$post(`/snbl/instant-voucher`, payload)
        console.log(res)
        if (res?.status.toLowerCase() === 'failed') {
          this.$toast.error(res.message)
          return
        }
        this.$toast.info(res?.message)
        this.$router.push('/SaveNow')
      } catch (err) {
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
.ps-14 {
  width: 25%;
}
.ps-15 {
  margin-top: 10px;
  margin-left: 4rem;
}
.ps-2-tab {
  width: 33.3%;
  text-align: center;
  margin-top: 2rem;
  border-bottom: 1px solid #d8d8d8;
  color: #d8d8d8;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
</style>
