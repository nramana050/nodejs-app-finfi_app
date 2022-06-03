<template lang="pug">
  div.flex.flex-col
    div.flex-0
      PageHeader(:title="'Cards'")
    div(v-if="cards")
      div.flex-0.p-4
        AccountCard(:account="account" :provider="organization")
      div.p-4
        p.uppercase.py-4.font-bold.tracking-wider Request for Cash
        div.relative
          input.h-12.pl-5.rounded.z-0.border.border-primary.w-full(class="focus:shadow focus:outline-none" type="text" placeholder="Enter amount" v-model="requestedAmount")
          div.absolute.top-0.right-0(v-if="requestedAmount > 0")
            button.h-12.w-24.text-white.rounded.bg-primary.uppercase.font-bold(@click="initCashRequest")
              span(v-if="inProgress")
                LoadingIcon.w-6.h-6.text-white.mx-auto
              span(v-else) Get Cash
    div(v-else)
      div.flex.p-4
        button.h-12.w-24.text-white.rounded.bg-primary.uppercase.font-bold
          span Get Card
        HorizontalStepper(:steps="demoSteps" @completed-step="completeStep" @active-step="isStepActive" @stepper-finished="alert")

</template>

<script>
import CardStep1 from '~/components/CardStep1.vue';
import CardStep2 from '~/components/CardStep2.vue';

export default {
  name: 'DashboardPage',

  layout: 'session',

  data() {
    return {
      demoSteps: [
        {
          icon: 'mail',
          name: 'first',
          title: 'Sample title 1',
          subtitle: 'Subtitle sample',
          component: CardStep1,
          completed: false

        },
        {
          icon: 'report_problem',
          name: 'second',
          title: 'Sample title 2',
          subtitle: 'Subtitle sample',
          component: CardStep2,
          completed: false
        }
      ]
    }
  },

  methods: {
    completeStep(payload) {
      this.demoSteps.forEach((step) => {
        if (step.name === payload.name) {
            step.completed = true;
        }
      })
    },
    // Executed when @active-step event is triggered
    isStepActive(payload) {
      this.demoSteps.forEach((step) => {
        if (step.name === payload.name) {
          if(step.completed === true) {
              step.completed = false;
          }
        }
      })
    },
  },
}
</script>
