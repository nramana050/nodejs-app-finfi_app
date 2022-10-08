<template lang="pug">
div.flex.flex-col.px-5.py-8#container
  div.flex.pb-2
    div.flex-1
      p.text-md.font-bold.tracking-wide.pb-4.underline.uppercase {{ step.title }}
    div.flex-0
      p.text-xs.font-light.font-mono.tracking-wide.text-red-500.uppercase.pb-2 Step {{ step.id }}/{{ steps.length }}
  div.flex-1
    Step1Component(v-if="step.id === 1" v-on:next="step1next" v-on:close="close")
    Step2Component(v-if="step.id === 2" v-on:next="step2next" v-on:close="close")
    Step3Component(v-if="step.id === 3" v-on:next="step3next" v-on:close="close")
    Step4Component(v-if="step.id === 4" v-on:restart="restart" v-on:reload="reload" v-on:close="close" :form="form")
</template>

<script>
import Step1Component from '~/components/M2P/Registration/Step1.vue'
import Step2Component from '~/components/M2P/Registration/Step2.vue'
import Step3Component from '~/components/M2P/Registration/Step3.vue'
import Step4Component from '~/components/M2P/Registration/Step4.vue'

export default {
  name: 'M2PRegistration',
  components: {
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
  },

  data() {
    return {
      form: {
        user: {},
        address: {},
        kyc: {},
      },
      steps: [
        {
          id: 1,
          title: 'User Verification',
        },
        {
          id: 2,
          title: 'Address',
        },
        {
          id: 3,
          title: 'KYC Documents',
        },
        {
          id: 4,
          title: 'Status',
        },
      ],
      currentStep: 1,
    }
  },

  computed: {
    step() {
      return this.steps[this.currentStep - 1]
    },
  },

  methods: {
    next() {
      this.currentStep += 1
    },
    step1next(data) {
      this.form.user = data
      this.next()
    },
    step2next(data) {
      this.form.address = data
      this.next()
    },
    step3next(data) {
      this.form.kyc = data
      this.next()
    },
    reload() {
      window.location.reload()
    },
    restart() {
      const _this = this
      setTimeout(function () {
        _this.currentStep = 1
      }, 500)
    },
    close() {
      this.$FModal.hide()
      const _this = this
      setTimeout(function () {
        _this.currentStep = 1
      }, 500)
    },
  },
}
</script>

<style scoped>
#container {
  min-height: 80vh;
}
</style>
