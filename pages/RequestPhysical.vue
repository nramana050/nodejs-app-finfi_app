<template lang="pug">
div.flex.flex-col.justify-center
  div.text-center.font-bold Request physical card
  FormulateForm(v-model="form") 
    div.flex.flex-cpl
      FormulateInput.pb-2.pr-3.w-full(type="text" name="address_line_1" validation="required" placeholder="Address Line 1")
    div.flex.flex-cpl
      FormulateInput.pb-2.pr-3.w-full(type="text" name="address_line_2" validation="required" placeholder="Address Line 2")
    div.flex.flex-cpl
      FormulateInput.pb-2.pr-3.w-full(type="text" name="address_line_3" validation="required" placeholder="Address Line 3")
    div.flex.flex-cpl
      FormulateInput.pb-2.pr-3.w-full(type="text" name="city" validation="required" placeholder="City")
    div.flex.flex-cpl
      FormulateInput.pb-2.pr-3.w-full(type="text" name="state" validation="required" placeholder="State")      
    div.flex.flex-cpl
      FormulateInput.pb-2.pr-3.w-full(type="text" name="pincode" validation="required" placeholder="Pincode")
    div.text-center.font-bold Card cost is ₹200 including delivery charges     
    div.flex-1.pr-4
      div.flex.flex-row.py-4.justify-center
        button.btn.h-8.px-4.text-white.justify-center.rounded.font-bold(@click="pay()")
          | Pay and Submit       
</template>

<script type="application/javascript" src="https://checkout.razorpay.com/v1/checkout.js"></script>

<script>
export default {
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
  name: 'RequestPhysical',
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
  background-color: #7165e3;
}
</style>
