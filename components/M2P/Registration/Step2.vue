<template lang="pug">
div.flex.flex-col.verify-user-details
  FormulateForm(v-model="form" @submit="next")
    FormulateInput(type="text" label="Flat, House no., Building, Apartment - as per Aadhaar" name="address_line_1" validation="required" @keydown="nameKeydown($event)")
    FormulateInput(type="text" label="Area, Street, Colony, Road, Lane - as per Aadhaar" name="address_line_2" validation="required" @keydown="nameKeydown($event)")
    FormulateInput(type="text" label="Village, Town, City - as per Aadhaar" name="address_line_3" validation="required" @keydown="nameKeydown($event)")
    div
    div.flex.flex-col
      FormulateInput(type="text" label="Pincode - as per Aadhaar" name="pincode" validation="required" maxlength="6" @keydown="nameKeydown($event)")
      FormulateInput(type="text" label="City, District" name="city" validation="required" @keydown="nameKeydown($event)")
      FormulateInput(type="select" label="State" name="state" :options="states" placeholder="Select state" validation="required")
    div.flex
        button.btn.h-8.px-4.text-white.rounded.font-bold(type="submit") Confirm
        
</template>

<script>
export default {
  name: 'Step2Component',

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
      states: {},
    }
  },

  async beforeMount() {
    const stateApiResult = await this.$axios.$get('/ext/states')
    for (const item of stateApiResult) {
      this.states[item] = item
    }
    const apiResult = await this.$axios.$get('/profile/address?type=BILLING', {
      headers: {
        Authorization: this.token,
      },
    })
    if (apiResult.length > 0) {
      this.form = apiResult[0]
    }
  },

  methods: {
    nameKeydown(e) {
      if (/^\W$/.test(e.key)) {
        e.preventDefault()
      }
    },
    async next() {
      try {
        await this.$axios.$post(
          '/profile/address',
          {
            address_type: 'BILLING',
            ...this.form,
          },
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
      } catch (err) {}
      this.$emit('next', this.form)
    },
    cancel(e) {
      this.$router.push('/cards')
      e.preventDefault()
      // this.$emit('close')
    },
  },
}
</script>
<style scoped>
.verify-user-details > .formulate-form label,
.verify-user-details .custom-label {
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1px;
  color: #979797;
}
.verify-user-details > .formulate-form input,
.verify-user-details > .formulate-form select {
  border: 1px solid #e9f0e6;
  border-radius: 12px;
  height: 42px;
  width: 100%;
}
.verify-user-details .mx-datepicker {
  width: 100%;
}
.verify-user-details .btn {
  height: 44px;
  background: #7165e3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  width: 100%;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ps-1 {
  margin-bottom: 1rem;
  text-align: center;
}
</style>
