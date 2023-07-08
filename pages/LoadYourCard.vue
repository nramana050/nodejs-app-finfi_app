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
    div.action-container(@click="payViaEasebuzz")
        button(class="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500") Add Money      
</template>

<script
  type="application/javascript"
  src="https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js"
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
        src: 'https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js',
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
    async payViaEasebuzz() {
      const _this = this
      try {
        const amt = parseInt(this.amount).toFixed(2)
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
            purpose: 'PrePaidCardLoadByEasebuzz',
            description: 'Adding Funds In Card',
          }
        )

        const { id: orderId, amount, currency } = razorpayOrderId.data
        const profileResult = await this.$axios.get('/profile')
        const { first_name, last_name, mobile, email } = profileResult.data
        const full_name = `${first_name} ${last_name}`
        
        const data={
                "txnid": orderId,
                "amount":amt.toString(),
                "name": full_name,
                "email":  email,
                "phone": mobile,
                "productinfo": "PrePaidCardLoad",
                "surl": "http://localhost:8000/pg/easebuzz/initiate/success",
                "furl": "http://localhost:3000/response",
                "udf1": "",
                "udf2": "",
                "udf3": "",
                "udf4": "",
                "udf5": "",
                "address1": "",
                "address2": "",
                "city": "",
                "state": "",
                "country": "",
                "zipcode": "",
                "sub_merchant_id": "",
                "unique_id": "",
                "split_payments": "",
                "customer_authentication_id": "",
                "udf6": "",
                "udf7": "",
                "udf8": "",
                "udf9": "",
                "udf10": ""
              }

          const getEasebuzzPaymentCred = await this.$axios.post(
          '/pg/easebuzz/initiate',data)

          if(!getEasebuzzPaymentCred.data.status){
            alert(getEasebuzzPaymentCred.data.data)
          }


        const key=getEasebuzzPaymentCred.data.key
        const access_key=getEasebuzzPaymentCred.data.access_key
        const env=getEasebuzzPaymentCred.env // EaseBuzz environment 

        const options = {
        access_key: access_key, // access key received via Initiate Payment
        
        onResponse: (response) =>  {
            // const res=JSON.stringify(response);
            const {status}=response
            if(status==="success"){
              _this.paymentResponse(amt)
            }
            else{
              this.$toast.error('Payment declined by user.')
            }
        },
        theme: "#7165E3" // color hex
        }
        

        const easebuzzCheckout = new EasebuzzCheckout(key, env);
        easebuzzCheckout.initiatePayment(options);
      } catch (err) {
        this.$toast.error('Failed to make payment')
      }


    },


    async paymentResponse(amt) {
        const loadCardBalance = await this.$axios.post('/nbfc/loadcard', {
          amount: amt,
        })

        this.$router.push('/dashboard')

        this.$toast.success(
          `Your account has been credited with a balance of ${amt}`
        )
    },

    // async onPaymentCancel() {
    //   console.log('Checkout form closed')
    // },

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
