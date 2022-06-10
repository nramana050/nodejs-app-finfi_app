<template lang="pug">
div
  div.flex.flex-col
    div.flex-0
      PageHeader(:title="'Cards'")
  div.flex.flex-col
    div.flex.p-4
      button.h-12.w-24.text-white.rounded.bg-primary.uppercase.font-bold(@click="openModal")
        span Get Card

</template>

<script>
import M2PRegistration from '~/components/M2P/Registration.vue';

export default {
  name: 'DashboardPage',

  layout: 'session',

  data() {
    return {

    }
  },
  methods: {
    openModal() {
      this.$FModal.show(
        { component: M2PRegistration },
      )
    },
  }
}
</script>
