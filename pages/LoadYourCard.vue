<template lang="pug">
div.flex.flex-col
  div.flex-0
    PageHeader.uppercase(:title="'Load Your Card'")
  div.load-your-card-container
    div.limt-info
        span Total Limit - &#8377;  200,000
        span Available Limit - &#8377;  50,000 
    div.amt-container  
        input(v-model="amount" class="p-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="text" placeholder="Enter Amount")
    div.action-container(@click="payViaRazor")
        button(class="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500") Load Via RazorPay             
 

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
    }
  },
  methods: {
    async payViaRazor() {
      console.log('AMOUNT::', this.amount)
      try {
        const amt = parseInt(this.amount)

        // const options = {
        //   amount: amt, // 100 = INR 1
        //   currency: 'INR',
        //   receipt: uuidv4(),
        // }
        // const response = await razorpay.orders.create(options)

        // console.log('RES::', response)
        const options = {
          order_id: 'order_LkSxGcMqCH2dEP',
          currency: 'INR',
          amount: amt,
          prefill: {
            name: 'Vaibhav Katariya',
            email: 'vaibhav@myfinfi.com',
            contact: '+919592184180',
          },
          theme: {
            color: '#7165E3',
          },
          handler: async (response) => {
            const verify_payment_response = await this.verifySignature(response)
            if (verify_payment_response.data.status) {
              this.$toast.success('Successfully bought the voucher.')
            } else {
              this.$toast.error('Failed to make the payment.')
            }
          },
        }
        const rzp1 = new Razorpay(options)
        rzp1.open()
      } catch (err) {
        console.log(err)
        this.$toast.error('Failed to make payment')
      }
    },
    async verifySignature(response) {
      return await this.$axios.post('/payment/gateway/verify', response)
    },
  },
}
</script>

<style scoped>
.load-your-card-container {
  padding: 20px;
  margin: 1.5rem;
  background-color: #fff;
  color: #1c1939;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.07908);
}
.limt-info > span {
  display: block;
}
.amt-container {
  margin-top: 20px;
}

.action-container {
  margin-top: 20px;
}
.action-container > button {
  width: 100%;
}
</style>
