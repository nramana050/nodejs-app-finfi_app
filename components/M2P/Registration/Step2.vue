<template lang="pug">
div.flex.flex-col
  FormulateForm(v-model="form" @submit="next")
    div.ps-1 Note: Please enter Address as in Aadhar.
    FormulateInput.pr-3(type="text" label="Address Line 1" name="address_line_1" validation="required" @keydown="nameKeydown($event)")
    FormulateInput.pr-3(type="text" label="Address Line 2" name="address_line_2" validation="required" @keydown="nameKeydown($event)")
    FormulateInput.pr-3(type="text" label="Address Line 3" name="address_line_3" validation="required" @keydown="nameKeydown($event)")
    div
      FormulateInput.pr-3(type="text" label="City" name="city" validation="required" @keydown="nameKeydown($event)")
      FormulateInput.pr-3(type="select" label="State" name="state" :options="states" placeholder="Select state" validation="required")
    div.flex.flex-col
      FormulateInput.pr-3(type="text" label="Pincode" name="pincode" validation="required" maxlength="6" @keydown="nameKeydown($event)")
    div.flex-1.pr-4
      div.flex.flex-row.py-4.justify-between
        button.btn.h-8.px-4.text-white.rounded.font-bold(type="submit") Next
        button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold(@click="cancel") Cancel
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
.btn {
  background-color: #7165e3;
}
.ps-1 {
  margin-bottom: 1rem;
  text-align: center;
}
</style>
