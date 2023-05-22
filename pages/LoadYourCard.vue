<template lang="pug">
div.flex.flex-col
  div.flex-0
    PageHeader.uppercase(:title="'Add Money'")
  div.maincontainer  
    div.load-your-card-container
      div.limt-info
        div.amt-info
          span.title Maximum limit of your card
          span.amt &#8377;  {{ cardLoadLimit.toLocaleString() }}
        div.amt-info
          span.title  Card Balance
          span.amt &#8377;  {{ cardLimit||0 }}
        div.amt-info
          span.title Maximum amount you can add
          span.amt &#8377;  {{ availableLimit.toLocaleString() }}
    div.amt-container  
      h3.title Enter amount 
      div.amt-input
        span ₹ 
        input(v-model="amount"  :max='cardLoadLimit' class="p-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="number" placeholder="Enter Amount")
    div.action-container(@click="payViaRazor")
        button(class="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500") Add Money      
</template>

<script
  type="application/javascript"
  src="https://checkout.razorpay.com/v1/checkout.js"
></script>
<script>
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'LoadYourCard',
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
      amount: 0,
      cardLoadLimit: 200000,
      accounts: this.$store.state.accounts,
      token: this.$auth.strategy.token.get(),
    }
  },
  computed: {
    cardLimit() {
      const cardAccount = this.accounts.filter(
        (item) => item.account_type === 'CARD'
      )
      return cardAccount.length > 0 ? cardAccount[0].account_balance : null
    },
    availableLimit() {
      return this.cardLoadLimit - this.cardLimit
    },
  },

  methods: {
    async payViaRazor() {
      const _this = this
      try {
        const amt = parseInt(this.amount)
        const amountRegex = /^(?!0*(\.0+)?$)\d+(\.\d+)?$/

        if (!amountRegex.test(amt)) {
          return this.$toast.error('Sorry, the amount you entered is not valid')
        }
        if (amt > this.availableLimit) {
          return this.$toast.error(
            'Sorry,the amount entered must be below or equal to the available limit'
          )
        }

        const razorpayOrderId = await this.$axios.post(
          '/payment/gateway/order_id',
          {
            amount: amt * 100,
            purpose: 'PrePaidCardLoad',
            description: 'Adding Funds In Card',
          }
        )

        const { id: orderId, amount, currency } = razorpayOrderId.data
        const profileResult = await this.$axios.get('/profile')
        const { first_name, last_name, mobile, email } = profileResult.data
        const full_name = `${first_name} ${last_name}`

        const options = {
          order_id: orderId,
          currency: currency,
          amount: amount,
          prefill: {
            name: full_name,
            email: email,
            contact: mobile,
          },
          theme: {
            color: '#7165E3',
          },
          handler: _this.paymentResponse,
          modal: {
            ondismiss: _this.onPaymentCancel,
          },
        }
        const rzp1 = new Razorpay(options)
        rzp1.open()
      } catch (err) {
        console.log(err)
        this.$toast.error('Failed to make payment')
      }
    },
    async paymentResponse(response) {
      const verify_payment_response = await this.verifySignature(response)
      if (verify_payment_response.data.status) {
        const loadCardBalance = await this.$axios.post('/nbfc/loadcard', {
          amount: amt,
        })
        this.$router.push('/dashboard')
        this.$toast.success(
          `Your account has been credited with a balance of ${amt}`
        )
      } else {
        this.$toast.error(verify_payment_response.data.message)
      }
    },
    async onPaymentCancel() {
      console.log('Checkout form closed')
    },
    async verifySignature(response) {
      const Response = { ...response, skiplog: true }
      return await this.$axios.post('/payment/gateway/verify', Response)
    },
  },
}
</script>

<style scoped>
.maincontainer {
  background: #f5f5f5;
  height: 100vh;
}
.load-your-card-container {
  padding: 20px;
  margin: 1.5rem;
  background-color: #fff;
  color: #1c1939;
  height: 160px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin-top: 4.5rem;
}

.limt-info > span {
  display: block;
}

.amt-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.amt-info .title {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
}
.amt-info .amt {
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  color: #1c1939;
}

.amt-container .title {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 23px;
  color: #1c1939;
  text-align: center;
  margin-bottom: 15px;
}

.amt-container,
.action-container {
  margin: 20px;
}

.action-container {
  position: absolute;
  bottom: 20px;
}
.amt-container .amt-input > span {
  font-size: 24px;
  line-height: 31px;
  color: #1c1939;
}
.amt-container .amt-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 10px;
  max-width: 200px;
  margin: 0 auto;
  font-size: 22px;
}
.amt-container .amt-input input {
  border: 0;
  outline: 0;
  box-shadow: none;
  margin: 0;
}
.action-container button {
  width: 350px;
  height: 44px;
  background: #7165e3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  text-align: center;
  color: #ffffff;
}
</style>
