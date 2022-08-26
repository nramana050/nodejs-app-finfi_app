<template lang="pug">
div
  div.flex.flex-col
    div.flex-0
      PageHeader(:title="'Cards'")
  div(v-if="isLoading")
    img#loader(src="~/assets/loader.gif")
  div(v-else)
    div.flex.flex-col(v-if="isCardAvailable")
      div.flex(v-if="card.url")
        object(:data="card.url" width="100%" height="240" type="text/html")
        //- iframe(:src="card.url" width="100%" height="320px")
      div.flex(v-else)
        div(width="100%" style="height:270px !important;")
          img#dummycard(src="https://static.thenounproject.com/png/2028787-200.png")
      div.flex-flex-col.mt-5.bg-gray-100
        div.flex.flex-row.justify-between.py-2.px-8
          span Kit Number
          span.font-bold.uppercase.tracking-wide {{ card.kitList }}
        div.flex.flex-row.justify-between.pb-2.px-8
          span Card Status
          span.font-bold.uppercase.tracking-wide {{ isCardBlocked ? 'BLOCKED' : 'ACTIVE' }}
        div.px-8.bg-white.pt-4
          div.flex.justify-between.is-align-items-center.pb-2
            div.miam.miam-active.pt-2 Block Card
            //- div.relative.inline-block.w-10.mr-2.align-middle.select-none.transition.duration-200.ease-in
            //-   input.toggle-checkbox.absolute.block.w-6.h-6.rounded-full.bg-white.border-4.appearance-none.cursor-pointer(type="checkbox" name="block" id="block" :value="isCardBlocked" @change="toggleCardStatus")
            //-   label.toggle-label.block.overflow-hidden.h-6.rounded-full.bg-gray-300.cursor-pointer( for="block")
            div.relative
              img(src="~/assets/toggle_on.png" v-if="isCardBlocked" @click="openUnblockCard")
              img(src="~/assets/toggle_off.png" v-else @click="openBlockCard")
        div.px-8.bg-white.pt-4
          div.grid.grid-cols-1.divide-y.border.rounded 
            div.flex.justify-between.px-4.py-2(@click="openCardSetting")
              span Card Preferences 
              span &#8250;
            div.flex.justify-between.px-4.py-2(@click="openCardPIN")
              span Set PIN 
              span &#8250;  
    div.flex.flex-col.p-4(v-else)
      div.p-2
        p.p-2 Please go through the 
          a.font-bold(href='https://www.myfinfi.com/' target="_blank") terms and condition
          //- p.text-xs
          //-   a(href='https://www.myfinfi.com/' target="_blank") *terms and conditions
        input.p-2(v-model="isTermsAccepted" :true-value="true" :false-value="false" type="checkbox")
        label  I accept the terms and condition 
      button.h-12.w-full.text-white.rounded.bg-primary.uppercase.font-bold(v-if="this.isTermsAccepted" @click="openRegistrationModal")
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
      isTermsAccepted:false,
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
    openUnblockCard() {
      this.$FModal.show({ component: UnblockCard }, { revert: this.revertLKUL })
    },
    openBlockCard() {
      this.$FModal.show({ component: BlockCard }, { revert: this.revertLKUL })
    },
    openCardPIN() {
      this.$FModal.show({ component: SetPIN })
    },
    async fetchCards() {
      this.isLoading = true;
      try {
        const cardList = await this.$axios.get(`/m2p/cards/list`);
        if (cardList.data.result.length > 0) {
          this.isCardAvailable = true;
          this.card = cardList.data.result[0];
          this.isCardBlocked = this.card.cardStatusList.toUpperCase() === 'LOCKED'
          await this.fetchCardDetail();
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$toasted.error(err.response.data.message);
      }
    },
    async fetchCardDetail() {
      const result2 = await this.$axios.get(`/m2p/cards`);
      this.card.kit_number = result2.data && result2.data.result ? result2.data.result.kit_number : '';
      this.card.url = result2.data && result2.data.result ? result2.data.result : '';
      setTimeout(async () => await this.fetchCardDetail(), 118000);
    },
    revertLKUL() {
      this.fetchCards();
    },
    close() {
      this.$FModal.hide();
    }
  }
}
</script>

<style scoped>
#dummycard {
  margin: auto !important;
  left: 50%;
  right: 50%;
  position: relative;
  top: 20%;
}
#loader {
  position: absolute;
  top: 25%;
}
a:hover {
  color: blue;
  /* text-decoration: underline; */
}
</style>
