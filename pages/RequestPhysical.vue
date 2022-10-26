<template lang="pug">
div.flex.flex-col.justify-center
  //- div.text-center.font-bold(v-if="isCardAvailable") Card Details 
  div.text-center.font-bold Request physical card
  FormulateForm(v-model="form" @submit="dash") 
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
        button.btn.h-8.px-4.text-white.justify-center.rounded.font-bold(type="submit")(@click="requestPhysicalCard()")
          | Pay and Submit
</template>

<script>
export default {

  // data() {
  //   return {
  //     user: this.$auth.user,
  //     token: this.$auth.strategy.token.get(),
  //     form: {
  //       first_name: this.$auth.user.first_name,
  //       last_name: this.$auth.user.last_name,
  //       mobile: this.$auth.user.mobile,
  //       email: this.$auth.user.email,
  //       otp: '',
  //       gender: '',
  //       dob: '',
  //     },
  //   }
  // },
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
        pincode: null,
      },
      isSameAddress: true,
      script: `https://checkout.razorpay.com/v1/checkout.js`,
      // states: {},
      // getAmount: 0,
      // monthlyDeposit: 0,
    }
  },
  methods: {
    dash(){
      console.log(this.form)
      // this.requestPhysicalCard()
      // this.pay()
      // alert('Submit Successfully')
      // .then(response => alert('Submitted!'))
      // .catch(function (error) {  
      //   // console.log(error);
      // })

      // console.log(this.form)
    },
    async requestPhysicalCard() {
      try{
        const response = await this.$axios.$post('/m2p/requestPhysicalCard', this.form,{
          headers: {
            Authorization: this.token,
          },
        })
        console.log("This is error")
        console.log(response)
        // console.log(requestPhysicalapi)
        // if (requestPhysicalapi.length > 0) {
        //   this.form = requestPhysicalapi[0]
        // }
        this.$toast.success('Payed Successfully')
      }
      catch (err) {
        this.$toast.error('Failed')
      }
    },
    async pay() {
      await this.$axios.post("/razarpay/payment") 
        .then(res => {
          const order = res.data;
          const options = {
            key: "rzp_test_5rnw5Qdn7jV2Pf",
            amount: order.amount,
            currency: 'INR',
            description: "For Card Payment",
            order_id: order.id,
            prefill: {
              name: order.name,
              email: order.email,
              contact: order.phone
            },
            theme: {
              color: "#3399cc" // Set your website theme color
            },
            // handler: response => {
            //   this.verifySignature(response)
            // }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        })
        .catch(err => {
          console.error(err);
        });
//         if(res.status == true){
// this.requestPhysicalCard();
//         }

    },
    
    

// requestPhys.. 
// payment




  },
}
</script>
<style scoped>
.btn {
  background-color: #7165e3;
}
</style>