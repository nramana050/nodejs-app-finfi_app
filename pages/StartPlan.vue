<template lang="pug">
    div
      div.flex.flex-row.text-white.border.p-4.items-center.ps-13
        button(@click="navToProductScreen")
          FaIcon.mx-auto.ps-12(icon='angle-left')
        h3.text-sm.font-bold.tracking-widest.uppercase {{this.selecteProduct.product.product_name}}
      div.flex.flex-row
        span.ps-2-tab(v-for="name in items" :key="items.id"
        @click="selectedItem(name.name)"
        :class="[itemSelected==name.name ? 'bg-blue-600' : 'bg-white']")
          button {{name.name}}   
      div(v-if="itemSelected=='Buy Later' && product")  
        div.ps-2
          div.ps-4.flex.flex-row.justify-between
            div.relative.pt-1
              div.flex.flex-row.justify-between
                span.ps-7 Your Goal amount
                span.ps-15 &#8377;
                input.ps-14(class="focus:outline-none focus:shadow-outline" type="numeric" v-bind:max="max" v-model="slidervalue1" @keydown="nameKeydown($event)")
              input#customRange1.form-range.w-full.h-6.p-0.bg-transparent(type='range' class='focus:outline-none focus:ring-0 focus:shadow-none' v-bind:min="min" v-bind:max="max" v-bind:step="step" v-model="slidervalue1")
          div.ps-4.flex.flex-row.justify-between
            div.relative.pt-1
              span.ps-7 Duration
              span.ps-10 {{slidervalue2}} Months
              input#customRange1.form-range.w-full.h-6.p-0.bg-transparent(type='range' class='focus:outline-none focus:ring-0 focus:shadow-none' min="1" max="12" v-model="slidervalue2")
          div.ps-5 Your Deposit &#8377; {{monthlyDeposit}} monthly <br> will be deducted from your Salary
          div.ps-3.custom-trans
            div.ps-4.flex.flex-row.justify-between
              span.font-bold You pay
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
                input.ps-14(class="focus:outline-none focus:shadow-outline" type="numeric" v-bind:max="max" v-model="slidervalue3" @keydown="nameKeydown($event)" v-if="!fixedSteps?.length")
                select.custom-select(v-if="fixedSteps?.length" v-on:change="selectVal")
                  option(value=amt v-for="amt in this.fixedSteps") {{ amt }}
              input#customRange1.form-range.w-full.h-6.p-0.bg-transparent(type='range' class='focus:outline-none focus:ring-0 focus:shadow-none' v-if="!fixedSteps?.length" v-bind:min="min" v-bind:max="max" v-bind:step="step"  v-model="slidervalue3")
              div.ps-5 &#8377; {{instantPayment}} will be deducted from your Salary.
              div.ps-5 Voucher Purchase T&Cs
                div.ps-3.custom-trans
                  div.ps-4.flex.flex-row.justify-between
                    span.font-bold You pay
                    span.font-bold You get
                  div.ps-4.flex.flex-row.justify-between
                    span.ps-12 &#8377; {{slidervalue3}}
                    span.ps-12 &#8377; {{getMerchDis}}
        div.ps-6
          div.pt-5.font-bold.text-xl.text-center How to use the vouchers
          div.ps-7 1.Vouchers will be delivered to your registered mobile number & registered email address. 
          div.ps-7 2.Discount amount will be transferred to your bank account within 3 working days.
          div.ps-7.pt-5(@click="openBlockCard" v-if="!slidervalue3==0")
            button.ps-8.font-bold Buy Now     
          div.ps-7.pt-2(@click="payViaRazor" v-if="!slidervalue3==0")
            button.ps-8.font-bold Pay Via RazorPay             

</template>

<script
  type="application/javascript"
  src="https://checkout.razorpay.com/v1/checkout.js"
></script>
<script>
import moment from 'moment'
import BuyNowConfim from '~/components/M2P/BuyNowConfim.vue'

export default {
  name: 'StartPlans',
  layout: 'empty',
  head: {
    script: [
      {
        type: 'text/javascript',
        src: 'https://checkout.razorpay.com/v1/checkout.js',
        async: true,
        body: true,
      },
    ],
  },
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
      product: '',
      fixedSteps: [],
      items: [
        // {
        //   id: '01',
        //   name: 'Buy Later',
        // },
        {
          id: '02',
          name: 'Buy Now',
        },
      ],
      itemSelected: 'Buy Now',
    }
  },
  computed: {
    selecteProduct() {
      return this.$store.state.snbl.product
    },
    min() {
      return this.$store.state.snbl.product.product.min
    },
    max() {
      return this.$store.state.snbl.product.product.max
    },
    step() {
      return this.$store.state.snbl.product.product.step
    },
  },
  mounted() {
    const _this = this
    this.product = this.selecteProduct.product
    if (this.product?.fixed_steps) {
      this.fixedSteps = this.product?.fixed_steps.split(',')
    }
    const merchantDis = this.selecteProduct.product.merchant_discount || 0
    this.slidervalue1 = this.selecteProduct.product.min
    this.slidervalue3 = this.fixedSteps?.length
      ? this.fixedSteps[0]
      : this.selecteProduct.product.min

    setInterval(function () {
      const today = moment()
      _this.currentDate = today.format('YYYY-MM-DD')
      const monthsLeft = today.add(_this.slidervalue2, 'months')
      _this.completeDate = monthsLeft.format('YYYY-MM-DD')
      _this.goal_amount = _this.slidervalue1
      _this.monthlyDeposit = parseFloat(
        _this.slidervalue1 / _this.slidervalue2
      ).toFixed(0)

      let finfiDis = 0
      if (_this.slidervalue2) {
        finfiDis = (_this.slidervalue2 - 1) / 2
      }
      const combineDiscount = parseFloat(merchantDis) + parseFloat(finfiDis)
      _this.getAmount = parseFloat(
        (_this.slidervalue1 * combineDiscount) / 100
      ).toFixed(0)
      _this.instantPayment = parseFloat(_this.slidervalue3).toFixed(0)
      _this.getMerchDis = parseFloat(
        (_this.slidervalue3 * merchantDis) / 100
      ).toFixed(0)
    }, 1000)
  },
  methods: {
    selectVal(e) {
      this.slidervalue3 = e.target.value
    },
    selectedItem(name) {
      this.itemSelected = []
      this.itemSelected.push(name)
    },
    navToProductScreen() {
      this.$router.push('/shopnow')
    },
    nameKeydown(e) {
      if (/^\W$/.test(e.key)) {
        e.preventDefault()
      }
    },
    openBlockCard() {
      this.$FModal.show(
        { component: BuyNowConfim },
        { amt: parseInt(this.instantPayment), buyNow: this.buyNow }
      )
    },
    close() {
      this.$FModal.hide()
    },
    async createOrder() {
      const payload = {
        product_id: this.selecteProduct.product.id,
        account_type: 'CARD',
        goal_amount: this.slidervalue1,
        frequency: 'monthly',
        status: 'ACTIVE',
        start_date: this.currentDate,
        end_date: this.completeDate,
      }
      try {
        await this.$axios.$post(`/snbl/order`, payload).then((result) => {
          this.data = result.data
        })
        this.$toast.info('Your Plan started successfully')
        this.$router.push('/shopnow')
      } catch (err) {
        this.$toast.error(err.message)
      }
    },
    async buyNow(razorpay_paid) {
      const payload = {
        product: this.selecteProduct.product,
        amount: parseInt(this.instantPayment),
        razorpay_paid: razorpay_paid,
      }
      try {
        const res = await this.$axios.$post(`/snbl/instant-voucher`, payload)
        if (res?.status.toLowerCase() === 'failed') {
          this.$toast.error(res.message)
          return
        }
        this.$toast.info(res?.message)
        this.$router.push('/shopnow')
      } catch (err) {
        this.$toast.error('Failed to start plan')
      }
    },
    async payViaRazor() {
      try {
        const data = {
          amount: parseInt(this.instantPayment),
          product: this.product,
        }
        await this.$axios
          .post('/payment/gateway/instant-voucher', data)
          .then((res) => {
            this.voucher_data = res.data.voucher_data
            const options = {
              order_id: res.data.order_id,
              currency: res.data.currency,
              amount: res.data.amount,
              key: res.data.key,
              name: res.data.name,
              description: res.data.description,
              image: res.data.image,
              prefill: {
                name: res.data.prefill.name,
                email: res.data.prefill.email,
                contact: res.data.prefill.contact,
              },
              theme: {
                color: res.data.theme.color,
              },
              handler: async (response) => {
                const verify_payment_response = await this.verifySignature(
                  response
                )
                if (verify_payment_response.data.status) {
                  this.buyNow(true)
                  this.$toast.success('Successfully bought the voucher.')
                } else {
                  this.$toast.error('Failed to make the payment.')
                }
              },
            }

            const rzp1 = new Razorpay(options)
            rzp1.open()
          })
      } catch (err) {
        console.log(err)
        this.$toast.error('Failed to buy the voucher')
      }
    },

    async verifySignature(response) {
      return await this.$axios.post('/payment/gateway/verify', response)
    },
  },
}
</script>
<style scoped>
.ps-2 {
  margin: 1.5rem;
  background-color: white;
  color: #1c1939;
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
.custom-trans {
  width: 100%;
}
</style>
