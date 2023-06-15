<template lang="pug">
    div.flex.flex-col
      FormulateForm(v-model="addressForm" @submit="next")
        div.ps-1 Note: Please enter Address as in Aadhar.
        FormulateInput.pr-3(type="text" label="Address Line 1" name="address_line_1" validation="required" )
        FormulateInput.pr-3(type="text" label="Address Line 2" name="address_line_2" validation="required" )
        //- FormulateInput.pr-3(type="text" label="Address Line 3" name="address_line_3" validation="required" @keydown="nameKeydown($event)")
        div
          FormulateInput.pr-3(type="text" label="Country" name="country" value="INDIA2" validation="required")
          FormulateInput.pr-3(type="select" label="State" name="state" :options="states" placeholder="Select state" validation="required")
          FormulateInput.pr-3(type="text" label="City" name="city" validation="required" @keydown="nameKeydown($event)")
        div.flex.flex-col
          FormulateInput.pr-3(type="number" label="Pincode" name="pincode" validation="required" maxlength="6" @keydown="nameKeydown($event)")
        div.flex.flex-col
          FormulateInput.pr-3(type="number" label="Income" name="monthly_income" validation="required" @keydown="nameKeydown($event)")
          div.flex.mt-4
            label.toggle-label.block.overflow-hidden.h-6.rounded-full.bg-white.cursor-pointer Is the current address the same as the permanent address?
            input.p-2(v-model="isSameAddress" :true-value="true" :false-value="false" type="checkbox")

        div.mt-4.duration-200(v-if="!isSameAddress")
          FormulateInput.pr-3(type="text" label="Current Address Line 1" name="current_address_line_1" validation="required" @keydown="nameKeydown($event)")
          FormulateInput.pr-3(type="text" label="Current  Address Line 2" name="current_address_line_2" validation="required" @keydown="nameKeydown($event)")
          div
            FormulateInput.pr-3(type="text" label="Current  Country" name="current_country"  validation="required")
            FormulateInput.pr-3(type="select" label="Current  State" name="current_state" :options="states" placeholder="Select state" validation="required")
            FormulateInput.pr-3(type="text" label="Current  City" name="current_city" validation="required" @keydown="nameKeydown($event)")
          div.flex.flex-col
            FormulateInput.pr-3(type="number" label="Current Pincode" name="current_pincode" validation="required" maxlength="6" @keydown="nameKeydown($event)")
        div.flex-1.pr-4
            div.flex.flex-row.py-4.justify-between
              button.btn.h-8.px-4.text-white.rounded.font-bold(type="submit") Sumbmit
              button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold(@click="cancel") Cancel
    </template>

<script>
export default {
  name: 'Step2Component',

  data() {
    return {
      token: this.$auth.strategy.token.get(),
      details: {},
      addressForm: {
        address_line_1: '',
        address_line_2: '',
        address_line_3: '',
        country: '',
        city: '',
        state: '',
        pincode: '',
        monthly_income:'',

        current_address_line_1: '',
        current_address_line_2: '',
        current_address_line_3: '',
        current_country: '',
        current_city: '',
        current_state: '',
        current_pincode: '',
      },
      isSameAddress: true,
      states: {},
    }
  },

  // async beforeMount() {
  //   // const apiResult = await this.$axios.$get('/profile/address?type=BILLING', {
  //   //   headers: {
  //   //     Authorization: this.token,
  //   //   },
  //   // })
  //   // if (apiResult.length > 0) {
  //   //   this.form = apiResult[0]
  //   // }
  // },

  async mounted() {
    const stateApiResult = await this.$axios.$get('/ext/states')

    for (const item of stateApiResult) {
      this.states[item] = item
    }
    await this.borrowerdetails()
  },

  methods: {
    nameKeydown(e) {
      if (/^\W$/.test(e.key)) {
        e.preventDefault()
      }
    },

    async borrowerdetails() {
      const url = 'nbfc/borrower/detail'
      try {
        const response = await this.$axios.$get(url)
        this.details = response.details[0]
        // console.log('This is a data', this.details)
        this.addressForm = this.details
        this.addressForm.state = this.details.state
        this.addressForm.country = 'INDIA'
        this.addressForm.current_country = 'INDIA'
        this.isSameAddress=this.details.is_same_address
        this.addressForm.current_city=this.details.current_address_city
        this.addressForm.current_country=this.details.current_address_country
        this.addressForm.current_state=this.details.current_address_state
        this.addressForm.current_pincode=this.details.current_address_pincode
        
      } catch (error) {
        this.$toast.error('')
      }
    },

    async next() {
      const url = '/nbfc/borrower/onboard'
      const payload = {
        address_line_1:this.addressForm.address_line_1,
        address_line_2:this.addressForm.address_line_2,
        country:this.addressForm.country,
        city:this.addressForm.city,
        state:this.addressForm.state,
        pincode:this.addressForm.pincode,
        monthly_income:this.addressForm.monthly_income,
        current_address_line_1:this.addressForm.current_address_line_1,
        current_address_line_2:this.addressForm.current_address_line_2,
        current_address_line_3:this.addressForm.current_address_line_3,
        current_city:this.addressForm.current_city,
        current_country:this.addressForm.current_country,
        current_state:this.addressForm.current_state,
        current_pincode:this.addressForm.current_pincode,
        is_same_address: this.isSameAddress,
       }
      try {
        const response = await this.$axios.$post(url, payload)
        if (!response.status) {
          this.$toast.info(response.message)
        }
        else{
          this.$router.push('/nbfcscreen')

        }
      } catch (error) {
        this.$toast.error('onboarding error')
      }
    },
    cancel(e) {
      this.$router.push('/dashboard')
      e.preventDefault()
      // this.$emit('close')
    },
  },
}
</script>
<style scoped>
.btn {
  background-color: #7165e3;
}
.ps-1 {
  margin-bottom: 1rem;
  text-align: center;
}
.toggle-label{
  font-size: 12px;
}
</style>
