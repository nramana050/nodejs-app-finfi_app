<template lang="pug">
div.flex.flex-col
  FormulateForm(v-model="form" @submit="next")
    FormulateInput.pr-3(type="text" label="Address Line 1" name="address_line_1" validation="required")
    FormulateInput.pr-3(type="text" label="Address Line 2" name="address_line_2" validation="required")
    FormulateInput.pr-3(type="text" label="Address Line 3" name="address_line_3" validation="required")
    div.flex.flex-row.justify-between
      FormulateInput.pr-3(type="text" label="City" name="city" validation="required")
      FormulateInput.pr-3(type="select" label="State" name="state" :options="states" placeholder="Select state" validation="required")
    div.flex.flex-col
      FormulateInput.pr-3(type="text" label="Pincode" name="pincode" validation="required")
    div.flex-1.pr-4
      div.flex.flex-row.py-4.justify-between
        button.h-8.px-4.text-white.rounded.bg-primary.font-bold(type="submit") Next
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
        pincode: ''
      },
      isSameAddress: true,
      states: {},
    }
  },

  async beforeMount() {
    const stateApiResult = await this.$axios.$get('/ext/states');
    for (const item of stateApiResult) {
      this.states[item] = item;
    }
    const apiResult = await this.$axios.$get('/profile/address?type=BILLING', {
      headers: {
        'Authorization': this.token
      }
    });
    if (apiResult.length > 0) {
      this.form = apiResult[0]
    }
  },

  methods: {
    async next() {
      try {
        await this.$axios.$post('/profile/address', {
          address_type: 'BILLING',
          ...this.form
        }, {
          headers: {
            'Authorization': this.token
          }
        });
      } catch (err) {}
      this.$emit('next', this.form);
    },
    cancel() {
      this.$emit('close');
    }
  }
}
</script>