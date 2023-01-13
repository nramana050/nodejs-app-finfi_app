<template lang="pug">
div.ps-1
  div.ps-4
    button(@click="navToDashboard")
      FaIcon.mx-auto.ps-9(icon='angle-left')
  div.flex.flex-col
    div.text-center.font-bold.ps-2 Request physical card
    FormulateForm.ps-6(v-model="form") 
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="text" name="address_line_1" validation="required" placeholder="Address Line 1" v-model="inputValue1")
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="text" name="address_line_2" validation="required" placeholder="Address Line 2" v-model="inputValue2")
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="text" name="address_line_3" validation="required" placeholder="Address Line 3" v-model="inputValue3")
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="text" name="city" validation="required" placeholder="City" v-model="inputValue4")
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="select" name="state" :options="states" v-model="selectedState" placeholder="Select state" validation="required")
      div.flex.flex-cpl.ps-3
        FormulateInput.pb-2.pr-3.w-full(type="text" name="pincode" validation="required" placeholder="Pincode" v-model="inputValue" maxlength="6")

      div(v-if="is_paid==false")  
        div.text-center.font-bold.ps-5 Card cost is ₹ {{physicalCardFee}} including delivery charges.

      div(v-else="is_paid==Paid")
        div.text-center.font-bold.ps-5 You have already made payment for the physical card.  
      div.flex-1.pr-4

      p.text-center.font-bold select your payment method.
      div(v-if="is_paid==false")
        div.flex.flex-row.py-4.justify-center
          button.btn.h-8.px-4.text-white.justify-center.rounded.font-bold(@click="requestPhysicalCardd()")
            | Razorpay
          button.btn.h-8.px-4.text-white.justify-center.rounded.font-bold(@click="requestWithEWA()")
            | EWA 
      div(v-else="is_paid==Paid")
        div.flex.flex-row.py-4.justify-center
          button.btn.h-8.px-4.text-white.justify-center.rounded.font-bold(@click="requestPhysicalCard(order_id)")
            | Submit 

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
      is_paid:false,
      order_id:false,
      physicalCardFee:0,
      form: {
        address_line_1: '',
        address_line_2: '',
        address_line_3: '',
        city: '',
        state: '',
        pincode: '',

      },
      states:[],
      selectedState:"",
      isSameAddress: true,
      inputValue: "",
      inputValue1: "",
      inputValue2: "",
      inputValue3: "",
      inputValue4: "",
      inputValue5: "",
    }
  },
  async beforeMount() {
    const stateApiResult = await this.$axios.$get('/ext/states');
    const physicalCardFee= await this.$axios.get("/organizations/config",{
      header:{
        Authorization:this.token
      }
    });
    this.physicalCardFee=physicalCardFee.data.physical_card_fee
    const cardPaymentStatus = await this.$axios.get("/m2p/requestPhysicalCard",{
      headers:{
        Authorization:this.token
      },
    });

    if(cardPaymentStatus.data.message==="Paid")
    {
      this.is_paid=cardPaymentStatus.data.message
      this.order_id=cardPaymentStatus.data.result
      this.form.address_line_1=cardPaymentStatus.data.data.address_line_1
      this.form.address_line_2=cardPaymentStatus.data.data.address_line_2
      this.form.address_line_3=cardPaymentStatus.data.data.address_line_3
      this.form.city=cardPaymentStatus.data.data.city
      this.form.state=cardPaymentStatus.data.data.state
      this.form.pincode=cardPaymentStatus.data.data.pincode
    }
    this.states = stateApiResult
    // console.log(stateApiResult)
  },
  watch: {
    inputValue(newValue) {
      if (this.checkAlphabets(newValue)) {
        this.inputValue = this.removeAlphabets(newValue);
      }
    },
    inputValue1(newValue1) {
      if (this.checkForSpecialCharacters(newValue1)) {
        this.inputValue1 = this.removeSpecialCharacters(newValue1);
      }
    },
    inputValue2(newValue2) {
      if (this.checkForSpecialCharacters(newValue2)) {
        this.inputValue2 = this.removeSpecialCharacters(newValue2);
      }
    },
    inputValue3(newValue3) {
      if (this.checkForSpecialCharacters(newValue3)) {
        this.inputValue3 = this.removeSpecialCharacters(newValue3);
      }
    },
    inputValue4(newValue4) {
      if (this.checkNumbers(newValue4)) {
        this.inputValue4 = this.removeNumbers(newValue4);
      }
    },
    inputValue5(newValue5) {
      if (this.checkForSpecialCharacters(newValue5)) {
        this.inputValue5 = this.removeSpecialCharacters(newValue5);
      }
    },
  },
  methods: {
    removeSpecialCharacters(charactersString) {
      return charactersString.replace(/[^\w\s]/gi, "");
    },
    removeNumbers(charactersStrings) {
      return charactersStrings.replace(/[^a-zA-Z0–9_]/g, "");
    },
    removeAlphabets(charactersStrings) {
      return charactersStrings.replace(/[^0-9]/g, "");
    },
    checkForSpecialCharacters(charactersString) {
      const specialCharactersRegex = /[^\w\s]/;
      return specialCharactersRegex.test(charactersString);
    },
    checkNumbers(charactersStrings) {
      const specialCharactersRegex = /[^a-zA-Z0–9_]/;
      return specialCharactersRegex.test(charactersStrings);
    },
    checkAlphabets(charactersStrings) {
      const specialCharactersRegex = /[^0-9]/;
      return specialCharactersRegex.test(charactersStrings);
    },
    navToDashboard() {
      this.$router.push('/Dashboard')
    },
    async requestPhysicalCard(order_id) {
      try {
        const payload = this.form
        payload.order_id = order_id
        const response = await this.$axios.$post('/m2p/requestPhysicalCard',payload,
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        console.log('res ',response)
        if(response.message && response.message === "Success" && response.result == true){
          this.$toast.success('Physical Card Request is success')
          this.$router.push('/ThankYou')
        }

        if(response.message == 'Fail' && response.result.result == false && response.result.exception.errorCode == 'Y3261'){
          this.$toast.success('Card is already registered for physical card')
          this.$router.push('/ThankYou')
        }
        else if(response.message == 'Fail'){
          this.$toast.error(response.result)
        }
      } catch (err) {
        console.log('err ',err)
        this.$toast.error('Failed')
      }
    },

    checkFields(){
      if(this.form.address_line_1 === "" )
      {
          this.$toast.error('Enter All Details Properly')
          return;
      }
      if(this.form.address_line_2 === "" )
      {
          this.$toast.error('Enter Valid Address')
          return;
      }
      if(this.form.address_line_3 === "" )
      {
          this.$toast.error('Enter Valid Address')
          return;
      }
      if(this.form.city === "" )
      {
          this.$toast.error('Enter Valid City Name')
          return;
      }
      if(this.selectedState === "" )
      {
          this.$toast.error('Enter Valid State')
          return;
      }
      if(this.form.pincode === "" )
      {
          this.$toast.error('Enter Valid Pincode')
          return;
      }
      return true;
    },

    async requestWithEWA(){
      try{
        const fieldCheck=this.checkFields()

        if(fieldCheck===true){
        const payload = this.form
        const response =await this.$axios.$post("/m2p/requestWithEWA",payload,{
          headers:{
            Authorization:this.token,
          },
        })
        if(response.result===true){
          this.$toast.success(response.message);
          this.requestPhysicalCard(response.order_id)

        }
        else{
          this.$toast.error(response.message);
        }
      }
      }
      catch(err){
        this.$toast.error(err)
      }
    },

    async requestPhysicalCardd() {

      if(this.form.address_line_1 === "" )
      {
          this.$toast.error('Enter All Details Properly')
          return;
      }
      if(this.form.address_line_2 === "" )
      {
          this.$toast.error('Enter Valid Address')
          return;
      }
      if(this.form.address_line_3 === "" )
      {
          this.$toast.error('Enter Valid Address')
          return;
      }
      if(this.form.city === "" )
      {
          this.$toast.error('Enter Valid City Name')
          return;
      }
      if(this.selectedState === "" )
      {
          this.$toast.error('Enter Valid State')
          return;
      }
      if(this.form.pincode === "" )
      {
          this.$toast.error('Enter Valid Pincode')
          return;
      }
      try {
        const response = await this.$axios.$get('/m2p/requestPhysicalCard',
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        // console.log('res ',response)
        // if(response.messag)
        if(response.message === "True"){
          this.pay(response)
        }
        else if(response.message === "False"){
          this.$toast.error('No Virtual Card')
        }
      } catch (err) {
        console.log('err ',err)
        this.$toast.error('Failed')
      }
    },

    //Razorpay payment window screen

    async pay() {
      console.log('selected state',this.selectedState)
      if(this.form.address_line_1 === "" )
      {
          this.$toast.error('Enter All Details Properly')
          return;
      }
      if(this.form.address_line_2 === "" )
      {
          this.$toast.error('Enter Valid Address')
          return;
      }
      if(this.form.address_line_3 === "" )
      {
          this.$toast.error('Enter Valid Address')
          return;
      }
      if(this.form.city === "" )
      {
          this.$toast.error('Enter Valid City Name')
          return;
      }
      if(this.selectedState === "" )
      {
          this.$toast.error('Enter Valid State')
          return;
      }
      if(this.form.pincode === "" )
      {
          this.$toast.error('Enter Valid Pincode')
          return;
      }
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
          console.log(response.data.status)
          if(response.data.status==true){
            this.requestPhysicalCard(response.data.order_id)
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

.ps-1 {
  background-color: white;
}

.ps-2 {
  margin: 1rem;
}

.ps-3 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.ps-4 {
  height: 2.5rem;
  background-color: #7165e3;
  width: full;
}

.ps-5 {
  height: 5rem;
  margin: 2rem;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;

}

.ps-6 {
  margin-top: 1rem;
}

.ps-9 {
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 12px;
  color: white;
}
</style>