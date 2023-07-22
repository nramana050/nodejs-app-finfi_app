<template lang="pug">
div.flex.flex-col.verify-user-details
  FormulateForm(v-model="form" @submit="next")
    FormulateInput(type="select" label="Document Type" name="document_type" :options="types" placeholder="Select document type" validation="required")
    FormulateInput(type="text" label="Document/ID no." name="document_display_number" validation="required" :input-class="['uppercase']")
    div.action 
      div.flex.flex-cpl.tnc-block
        FormulateInput(type="checkbox" name="agree" v-model="agree" )
        div.tnc I have read & agreed to the 
        a(@click="navToTnC" target="_blank") Terms & Conditions.
      //- div.req-msg(v-if='!this.agree') Check Terms & Conditions 
    div.flex
        button(:disabled="!this.agree" type="submit" :class="`btn h-8 px-4 text-white rounded font-bold ${!agree? 'disabled':' '}`") Verify with an OTP
</template>

<script>
const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
export default {
  name: 'Step3Component',

  data() {
    return {
      form: {
        document_type: '',
        document_number: '',
        document_display_number: '',
      },
      agree: false,
      types: { PAN: 'PAN Card' },
    }
  },

  async beforeMount() {
    try {
      const apiResult = await this.$axios.$get('/profile/kyc/docs?type=PAN', {
        headers: {
          Authorization: this.token,
        },
      })
      if (apiResult.length > 0) {
        const data = { ...apiResult[0] }
        data.document_number = Buffer.from(
          data.document_number,
          'base64'
        ).toString('ascii')
        this.form.document_type = data.document_type
        this.form.document_number = data.document_number
        this.form.document_display_number = Buffer.from(
          apiResult[0]?.document_number,
          'base64'
        ).toString('ascii')
      }
    } catch (error) {
      console.log(error)
    }
  },

  methods: {
    navToTnC() {
      this.$router.push('/TermsAndConditions')
    },
    async generateOTP() {
      return await this.$axios.$post('/m2p/otp', {
        headers: {
          Authorization: this.token,
        },
      })
    },
    async next() {
      try {
        if (!regex.test(this.form.document_display_number.toUpperCase())) {
          this.$toast.error('Enter a valid PAN number')
          return
        }

        const payload = {
          document_number: Buffer.from(
            this.form.document_display_number.toUpperCase()
          ).toString('base64'),
          document_type: this.form.document_type,
        }

        await this.$axios.$post('/profile/kyc/docs', payload, {
          headers: {
            Authorization: this.token,
          },
        })
        const otpRes = await this.generateOTP()
        if (otpRes?.message === 'Success') {
          this.$emit('next', this.form)
        }
      } catch (err) {
        this.$toast.error(err?.response?.data?.message || err.message)
      }
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
.verify-user-details .btn.disabled {
  background: #979797;
  cursor: initial;
}

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
.tnc-block {
  margin: 15px 0px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #898a8d;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 5px;
}
.tnc-block a {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-decoration-line: underline;
  color: #7165e3;
}
.req-msg {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #ff5141;
  margin-bottom: 15px;
  padding-left: 7px;
}
.action {
  position: relative;
  bottom: 0px;
}
</style>
