<template lang="pug">
div
  div.flex.flex-col
    div.flex-0
      PageHeader(:title="'Cards'")
  div(v-if="!isLoading")
    div.flex.flex-col(v-if="isCardAvailable")
      div.flex(v-if="card.url")
        iframe(:src="card.url" width="100%" height="320px")
      div.flex(v-else)
        div(width="100%" style="height:270px !important;")
          img(src="https://static.thenounproject.com/png/2028787-200.png")
      div.flex-flex-col.mt-5.bg-gray-100
        div.flex.flex-row.justify-between.py-2.px-8
          span Kit Number
          span.font-bold.uppercase.tracking-wide {{ card.kit_number }}
        div.flex.flex-row.justify-between.pb-2.px-8
          span Card Status
          span.font-bold.uppercase.tracking-wide {{ card.cardStatusList }}
        div.px-8.bg-white.pt-4
          div.grid.grid-cols-1.divide-y.border.rounded
            div.flex.justify-between.px-4.py-2(@click="openCardSetting")
              span Card Settings 
              span &#8250;
            div.flex.justify-between.px-4.py-2(@click="openCardBlock" v-if="!isCardBlocked")
              span Block Card
              span &#8250;
            div.flex.justify-between.px-4.py-2(@click="openCardUnblock" v-if="isCardBlocked")
              span Unblock Card
              span &#8250;
            div.flex.justify-between.px-4.py-2(@click="openCardPIN")
              span Set PIN 
              span &#8250;  

    div.flex.p-4(v-else)
      button.h-12.w-24.text-white.rounded.bg-primary.uppercase.font-bold(@click="openRegistrationModal")
        span Get Card

</template>

<script>
import M2PRegistration from '~/components/M2P/Registration.vue';
import SetPreference from '~/components/M2P/SetPreference.vue';
import BlockCard from '~/components/M2P/BlockCard.vue';
import UnblockCard from '~/components/M2P/UnblockCard.vue';
import SetPIN from '~/components/M2P/SetPIN.vue';

export default {
  name: 'DashboardPage',

  layout: 'session',

  data() {
    return {
      isLoading: true,
      isCardAvailable: false,
      isCardBlocked: false,
      card: null,
    }
  },
  mounted() {
    this.fetchCards();
  },
  methods: {
    openRegistrationModal() {
      this.$FModal.show({ component: M2PRegistration })
    },
    openCardSetting() {
      this.$FModal.show({ component: SetPreference })
    },
    openCardBlock() {
      this.$FModal.show({ component: BlockCard })
    },
    openCardUnblock() {
      this.$FModal.show({ component: UnblockCard })
    },
    openCardPIN() {
      this.$FModal.show({ component: SetPIN })
    },
    async fetchCards() {
      this.isLoading = true;
      try {
        const cardList = await this.$axios.get(`/m2p/cards/list`);
        this.isCardAvailable = true;
        this.card = cardList.data[0];
        this.isCardBlocked = this.card.cardStatusList.toUpperCase() === 'LOCKED'
        const result2 = await this.$axios.get(`/m2p/cards`);
        this.card.kit_number = result2.data ? result2.data.kit_number : '';
        this.card.url = result2.data ? result2.data.result : '';
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$toasted.error('Failed to fetch cards');
      }
    },
    close() {
      this.$FModal.hide();
    }
  },
}
</script>

<style scoped>
img {
  margin: auto !important;
  left: 50%;
  right: 50%;
  position: relative;
  top: 20%;
}
</style>
