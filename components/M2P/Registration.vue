<template lang="pug">
div
  div.flex.flex-row.justify-between.ps-1
    span.step-header
      FaIcon.mx-auto.ps-3(icon='angle-left' @click="navStepBack")
      p.text-md.font-bold.tracking-wide {{ step.title }}
    //- span.ps-3
    //-   p.text-xs.font-light.font-mono.tracking-wide Step {{ step.id }}/{{ steps.length }}
  div.ps-4
    Step1Component(v-if="step.id === 1" v-on:next="step1next" v-on:close="close")
    Step2Component(v-if="step.id === 2" v-on:next="step2next" v-on:close="close")
    Step3Component(v-if="step.id === 3" v-on:next="step3next" v-on:close="close")
    Step4Component(v-if="step.id === 4" :resetSteps="restart" v-on:reload="reload" v-on:close="close" :form="form")
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
  layout: 'empty',

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
          title: 'Verify Your details',
        },
        {
          id: 2,
          title: 'Aadhaar Address',
        },
        {
          id: 3,
          title: 'Documents',
        },
        {
          id: 4,
          title: 'Verify with an OTP',
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
    navStepBack() {
      if (this.step?.id === 1) {
        this.$router.push('/dashboard')
      } else {
        this.currentStep -= 1
      }
    },
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
.step-header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.step-header > svg {
  cursor: pointer;
}
#container {
  min-height: 80vh;
}
.ps-1 {
  height: 2.5rem;
  background-color: #7165e3;
  color: white;
}
.ps-2 {
  padding: 8px;
  margin-left: 1rem;
}
.ps-3 {
  padding: 12px;
  margin-right: 1rem;
}
.ps-4 {
  margin: 1rem;
}
</style>
