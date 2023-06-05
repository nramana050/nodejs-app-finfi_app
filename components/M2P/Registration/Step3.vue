<template lang="pug">
div.flex.flex-col.verify-user-details
  FormulateForm(v-model="form" @submit="next")
    FormulateInput(type="select" label="Document Type" name="document_type" :options="types" placeholder="Select document type" validation="required")
    FormulateInput(type="text" label="Document/ID no." name="document_number" validation="required" :input-class="['uppercase']")
    div.flex
        button.btn.h-8.px-4.text-white.rounded.font-bold(type="submit") Verify with an OTP
</template>

<script>
export default {
  name: 'Step3Component',

  data() {
    return {
      form: {
        document_type: '',
        document_number: '',
      },
      types: { PAN: 'PAN Card' },
    }
  },

  async beforeMount() {
    // const apiResult = await this.$axios.$get('/profile/kyc/docs?type=PAN', {
    //   headers: {
    //     Authorization: this.token,
    //   },
    // })
    // if (apiResult.length > 0) {
    //   const data = apiResult[0]
    //   data.document_number = Buffer.from(
    //     data.document_number,
    //     'base64'
    //   ).toString('ascii')
    //   this.form.document_type = data.document_type
    //   this.form.document_number = data.document_number
    // }
  },

  methods: {
    async next() {
      this.form.document_number = Buffer.from(
        this.form.document_number
      ).toString('base64')
      try {
        await this.$axios.$post('/profile/kyc/docs', this.form, {
          headers: {
            Authorization: this.token,
          },
        })
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
<style>
.verify-user-details {
  height: 100vh;
}
.verify-user-details > form {
  margin-top: 20px;
  min-height: 100vh;
}
.verify-user-details > form > div {
  margin-bottom: 10px;
}
.verify-user-details > .formulate-form label,
.verify-user-details .custom-label {
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1px;
  color: #979797;
}
.verify-user-details > .formulate-form input,
.formulate-input-element.formulate-input-element--select > select {
  border: 1px solid #e9f0e6;
  border-radius: 12px;
  height: 42px;
  width: 100%;
  text-align: left;
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
.action {
  position: relative;
  bottom: 0px;
}
</style>
