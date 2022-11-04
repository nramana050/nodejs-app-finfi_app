<template lang="pug">
div.ps-1
  div.ps-4
  div.flex.flex-col
    div.text-center.font-bold.ps-2 Request physical card
    FormulateForm.ps-6(v-model="form") 
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="text" name="address_line_1" validation="required" placeholder="Address Line 1")
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="text" name="address_line_2" validation="required" placeholder="Address Line 2")
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="text" name="address_line_3" validation="required" placeholder="Address Line 3")
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="text" name="city" validation="required" placeholder="City")
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="text" name="state" validation="required" placeholder="State")      
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="text" name="pincode" validation="required" placeholder="Pincode")
      div.text-center.font-bold.ps-5 Card cost is ₹300 including delivery charges     
      div.flex-1.pr-4
        div.flex.flex-row.py-4.justify-center
          button.btn.h-8.px-4.text-white.justify-center.rounded.font-bold(@click="pay()")
            | Pay and Submit 
      //- buttonComponent(:buttonName="'Pay and Submit'" @click="pay()")
        | Pay and Submit
</template>

<script type="application/javascript" src="https://checkout.razorpay.com/v1/checkout.js"></script>

<script>
export default {
  name:'RequestPhysical',
  layout:'empty',
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
      token: this.$auth.strategy.token.get(),
      form: {
        address_line_1: '',
        address_line_2: '',
        address_line_3: '',
        city: '',
        state: '',
        pincode: '',
      },
      isSameAddress: true,
    }
  },

  methods: {
    async requestPhysicalCard() {
      try {
        const response = await this.$axios.$post('/m2p/requestPhysicalCard',this.form,
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        if(response.result.result == true){
          this.$toast.success('Physical Card Request is success')
        }
        if(response.message == 'False'){
          this.$toast.error(response.result)
        }
        if(response.result.result == false && response.result.exception.errorCode == 'Y3261'){
          this.$toast.success('Card is registered for physical card')
        }
      } catch (err) {
        this.$toast.error('Failed')
      }
    },

    //Razorpay payment window screen

    async pay() {
      const data = {
        product_id: 1
      }
      await this.$axios.post('/payment/gateway/order', data).then((res) => {
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
          handler: response => {
              this.verifySignature(response);
          }
        }
        const rzp1 = new Razorpay(options)
        rzp1.open()
      })
    },

    //For Verify the Payment Signature

    async verifySignature(response) {
      await this.$axios
        .post('/payment/gateway/verify', response)
        .then((response) => {
          console.log(response)
          alert('payment received')
          console.log(response.data.status)
          if(response.data.status==true){
            this.requestPhysicalCard()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>
<style scoped>
.btn {
    color: white;
    background-color: #7165e3;
    height: 2.5rem;
    width: 20rem;
    margin-left: 2rem;
    margin-right: 2rem;
    margin-bottom: 2rem;
}
.ps-1{
  background-color: white;
}
.ps-2{
  margin: 1rem;
}
.ps-3{
  padding-left: 2rem;
  padding-right: 2rem;
}
.ps-4{
  height: 2.5rem;
  background-color: #7165e3;
  width: full;
}
.ps-5{
  height: 5rem;
  margin: 2rem;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  
}
.ps-6{
  margin-top: 1rem;
}
</style>
