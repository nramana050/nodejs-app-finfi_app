<template lang="pug">
  div.ps-3.shop-container
    div.flex-0 
      PageHeader.font-bold(:title="'Buy Voucher'")
      div.main-container
        div.px-4
          div.how_it_works.container
                div.header
                  span.info {{isHowItWorks ? "How to use voucher" : `Buy ${selectedProduct?.product?.product_name} Voucher`}} 
                  span.takeaction(@click="toggleHowItWorks") {{isHowItWorks ? "Back" : "How it works?"}}
                div.body(v-if='!isHowItWorks')
                  img(:src="baseUrl+selectedProduct.product.product_image" crossorigin="anonymous")
                div.purchase(v-if='!isHowItWorks')
                  div.addValue
                    input(class="focus:outline-none focus:shadow-outline" ref='voucherAmt' type="numeric" v-bind:min="min" v-bind:max="max" v-model="voucherAmount" @keydown="nameKeydown($event)")  
                    span Voucher Amount
                  div.cashback-received
                    input(class="focus:outline-none focus:shadow-outline" ref='cashbackAmt' type="numeric" disabled=true)  
                    span Cashback
                div.action(v-if='!isHowItWorks')
                  div.slide-product-availability
                      span.mode(v-if="isOnline")
                        img(src="~/assets/myfinfi-icons/online.png")
                        span  Online
                      span.mode(v-if="isInStore")
                        img(src="~/assets/myfinfi-icons/instore.png")
                        span  In-Store
                div.content.steps(v-if='isHowItWorks')
                  div.step1
                    h3.step1-color  Step 1
                    p Buy the voucher and get cashback on your bank account
                  div.step2
                    h3.step2-color  Step 2
                    p You will get a voucher from FINFI on eMail & SMS
                  div.step3
                    h3.step3-color  Step 3
                    p Use the voucher in th brand store or website/app as per their policy
                    p 
                      span in 
                      span on
          div.steps-to-redeem
            h3 Steps To Redeem
            ul 
              li Gift Cards can be redeemed at Chumbak stores and chumbak.com.              
              li For In store purchase, visit the outlet near you.              
              li Choose the products you would like to buy.             
              li Show your Gift Card details to the cashier at the time of billing & pay any balance amount by cash or card.
              li For online purchase, add the product to shopping cart.
              li On the payment page, Click on the tab ""Gift Cards/Voucher"" and enter the 16 digit Gift Card number and PIN to redeem.   
            div.tnc
             img(src="~/assets/myfinfi-icons/check.png")
             p By continuing you agree to the brand’s & our 
              span Terms & Conditions  
            div.make-payment
             button.via-payment-gateway(@click="payViaRazor") Buy from Payment Gateway
             button.via-salary-advance Buy from Salary Advance             
     
    

</template>

<script
  type="application/javascript"
  src="https://checkout.razorpay.com/v1/checkout.js"
></script>
<script>
export default {
  name: 'ShoppingCart',
  layout: 'session',
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
      isHowItWorks: false,
      baseUrl: 'https://myfinfi-uat-uploads.s3.ap-south-1.amazonaws.com',
      selectedProduct: this.$store.getters.getShopCart,
      voucherAmount: this.$store.getters.getShopCart?.product?.min,
    }
  },
  mounted() {
    this.focusVoucherAmount()
  },
  computed: {
    min() {
      return this.selectedProduct.product.min
    },
    max() {
      return this.selectedProduct.product.max
    },
    isInStore() {
      return (
        this.selectedProduct.product?.acceptance_mode === 'INSTORE' ||
        this.selectedProduct.product?.acceptance_mode === 'OFFLINE' ||
        this.selectedProduct.product?.acceptance_mode === 'BOTH'
      )
    },
    isOnline() {
      return (
        this.selectedProduct.product?.acceptance_mode === 'ONLINE' ||
        this.selectedProduct.product?.acceptance_mode === 'BOTH'
      )
    },
  },
  methods: {
    toggleHowItWorks() {
      this.isHowItWorks = !this.isHowItWorks
    },
    focusVoucherAmount() {
      this.$refs.voucherAmt.focus()
    },
    nameKeydown(e) {
      if (/^\W$/.test(e.key)) {
        e.preventDefault()
      }
    },
    async payViaRazor() {
      try {
        const razorpayOrderId = await this.$axios.post(
          '/payment/gateway/order_id',
          {
            amount: parseInt(this.voucherAmount) * 100,
            purpose: 'InstantVoucher',
            description: 'Payment for Instant Voucher',
          }
        )

        const { id: orderId, amount, currency } = razorpayOrderId.data

        const profileResult = await this.$axios.get('/profile')
        const { first_name, last_name, mobile, email } = profileResult.data
        const full_name = `${first_name} ${last_name}`

        const options = {
          order_id: orderId,
          currency: currency,
          image: 'https://app.myfinfi.com/_ipx/s_140x140/finfi.png',
          amount: amount,
          prefill: {
            name: full_name,
            email: email,
            contact: mobile,
          },
          theme: {
            color: '#7165E3',
          },
          handler: async (response) => {
            const verify_payment_response = await this.verifySignature(response)
            if (verify_payment_response.data.status) {
              this.buyNow(true, orderId)
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
        this.$toast.error('Failed to buy the voucher')
      }
    },

    async verifySignature(response) {
      const Response = { ...response, skiplog: true }
      return await this.$axios.post('/payment/gateway/verify', Response)
    },
  },
}
</script>
<style scoped>
/** STEPS TO REDEEM */
.steps-to-redeem {
  position: relative;
  top: -10px;
}
.steps-to-redeem h3 {
  font-weight: 400;
  font-size: 18px;
  line-height: 23px;
  color: #000000;
  margin: 0px 0px 20px;
  text-align: center;
}

.steps-to-redeem ul {
  list-style: disc;
}
.steps-to-redeem ul li {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #898a8d;
  margin-bottom: 10px;
}
.tnc {
  font-size: 12px;
  line-height: 16px;
  color: #898a8d;
  margin-top: 30px;
  display: flex;
  align-items: center;
}
.tnc img {
  margin-right: 10px;
}
.tnc span {
  font-size: 12px;
  line-height: 16px;
  text-decoration-line: underline;
  color: #7165e3;
}

.make-payment {
  margin-top: 10px;
}
.make-payment button.via-payment-gateway {
  height: 28px;
  background: #ffffff;
  border: 1px solid #979797;
  border-radius: 10px;
  font-size: 13px;
  line-height: 17px;
  color: #898a8d;
  display: block;
  margin: 0 auto;
  width: 232px;
  margin-bottom: 10px;
}
.make-payment button.via-salary-advance {
  height: 28px;
  background: #7165e3;
  border-radius: 10px;
  font-size: 13px;
  line-height: 17px;
  color: #ffffff;
  display: block;
  margin: 0 auto;
  width: 232px;
  margin-bottom: 10px;
}

.shop-container > div > div:nth-child(1) {
  height: 100px;
  padding-top: 0;
}
.main-container {
  background: #f5f5f5;
  min-height: 100vh;
}

/* component h-i-w */
.how_it_works.container {
  background: #ffffff;
  box-shadow: 0px 30px 60px rgba(0, 0, 0, 0.0790811);
  border-radius: 10px;
  min-height: 190px;
  position: relative;
  top: -40px;
  padding: 10px 20px;
}
.how_it_works.container > .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.how_it_works.container > .header > .info {
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  color: #1c1939;
}
.how_it_works.container > .header > .takeaction {
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  color: #7165e3;
  cursor: pointer;
}
.how_it_works.container > .body {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0px;
}
.how_it_works.container > .body img {
  height: 56px;
}
.how_it_works.container > .purchase {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.how_it_works.container > .purchase > div {
  text-align: center;
}
.how_it_works.container > .purchase > div > input {
  border-bottom: 1px solid #7165e3;
  max-width: 80px;
  font-size: 18px;
  line-height: 23px;
  text-align: center;
  color: #898a8d;
}
.how_it_works.container > .purchase > div > span {
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  color: #7165e3;
  display: block;
  margin-top: 10px;
}
.how_it_works.container > .action > button {
  width: 130px;
  height: 28px;
  background: #7165e3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  color: #fff;
}

.how_it_works.container > .content.steps {
  display: flex;
  justify-content: space-between;
}
.step1-color {
  color: #7165e3;
}
.step2-color {
  color: #bc9f27;
}
.step3-color {
  color: #4bb0a4;
}
.how_it_works.container > .content.steps p {
  font-weight: 400;
  font-size: 11px;
  line-height: 14px;
  color: #898a8d;
}
.how_it_works.container > .content.steps > div > h3 {
  margin-bottom: 10px;
}
.how_it_works.container > .content.steps > div > p:nth-child(2) {
  border-right: 1px solid #e9e9fc;
  padding-right: 5px;
}
.how_it_works.container > .content.steps > div:nth-child(3) > p:nth-child(2) {
  border-right: 0px;
}
.how_it_works.container > .content.steps > div {
  margin-right: 5px;
  max-width: 87px;
}
/* component h-i-w */

/* search component */
#search-product {
  margin-top: 10px;
  height: 48px;
  width: 100%;
  font-size: 18px;
  padding: 10px;
  background: #ffffff;
  border: 1px solid #e6e8e6;
  border-radius: 12px;
}
/* search component */

/* Product Slider */
.corp-exp.products {
  margin-top: 10px;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
}
.corp-exp.products > div {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.corp-exp.products > h3 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.corp-exp.products > h3 > span.action {
  color: #4c83b3;
  cursor: pointer;
}
.custom-pro-slide {
  text-align: center;
  background-color: #fff;
  width: 165px;
  border-radius: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
  margin: 5px;
}
.custom-pro-slide > .slide-header {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #7165e3;
  margin: 0 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.custom-pro-slide > .slide-header > img {
  height: 70px;
  width: 75px;
}
.custom-pro-slide .slide-content {
  padding: 0px 5px;
  min-height: 80px;
}
.slide-product-availability {
  display: flex;
  justify-content: flex-end;
  padding: 15px;
  padding-bottom: 0;
}
.slide-product-availability .mode {
  display: flex;
  font-size: 12px;
  line-height: 16px;
  color: #898a8d;
}
.slide-product-availability .mode img {
  margin-right: 5px;
  height: 12px;
  width: 12px;
  top: 2px;
  position: relative;
}
.custom-pro-slide .slide-content .product-name {
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  color: #000000;
}
.custom-pro-slide .slide-content .product-discount {
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #898a8d;
}
/* Product Slider */

.ps-2 {
  width: 33.3%;
  text-align: center;
  margin-top: 2rem;
  border-bottom: 1px solid #d8d8d8;
  color: #d8d8d8;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
.ps-3 {
  min-height: 100vh;
}
</style>
