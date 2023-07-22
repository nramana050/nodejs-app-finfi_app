<template lang="pug">
div.flex.flex-col
  FormulateForm(v-model="form" @submit="next")
    FormulateInput.pr-3(type="select" label="Document Type" name="document_type" :options="types" placeholder="Select document type" validation="required")
    FormulateInput.pr-3(type="text" label="Document Number" name="document_number" validation="required" :input-class="['uppercase']")
    div.flex-1.pr-4
      div.flex.flex-row.py-4.justify-between
        button.btn.h-8.px-4.text-white.rounded.font-bold(type="submit") Next
        button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold(@click="cancel") Cancel
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
    const apiResult = await this.$axios.$get('/profile/kyc/docs?type=PAN', {
      headers: {
        Authorization: this.token,
      },
    })
    if (apiResult.length > 0) {
      const data = apiResult[0]
      data.document_number = Buffer.from(
        data.document_number,
        'base64'
      ).toString('ascii')
      this.form.document_type = data.document_type
      this.form.document_number = data.document_number
    }
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
<style scoped>
.btn {
  background-color: #7165e3;
}
</style>
