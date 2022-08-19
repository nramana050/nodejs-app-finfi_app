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
        iframe(:src="card.url" width="100%" height="220px")
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
          div.flex.justify-between.pb-2
            div.miam.miam-active Block Card
            label.inline-flex.relative.items-center.cursor-pointer(for='default-toggle2')
              input#default-toggle2.sr-only.peer(type='checkbox' v-model="isCardBlocked" @change="toggleCardStatus")
              .w-11.h-6.bg-gray-200.rounded-full.peer(class="peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600")
              span.ml-3.text-sm.font-medium.text-gray-900(class='dark:text-gray-300')
          button.h-8.px-4.text-white.rounded.bg-primary.uppercase(v-if="!(this.vkycMessage==='COMPLETED')" @click="vkyc") Complete VKYC
          p(v-if="this.vkycMessage") Vkyc Status : {{this.vkycMessage}} 
        div.px-8.bg-white.pt-4
          div.grid.grid-cols-1.divide-y.border.rounded 
            div.flex.justify-between.px-4.py-2(@click="openCardSetting")
              span Card Preferences 
              span &#8250;
            div.flex.justify-between.px-4.py-2(@click="openCardPIN")
              span Set PIN 
              span &#8250;  
    div.flex.flex-col.p-4(v-else)
      p.pb-8 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      button.h-12.w-full.text-white.rounded.bg-primary.uppercase.font-bold(@click="openRegistrationModal")
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
      vkycMessage:null,
    }
  },

  mounted() {
    this.fetchCards();
    this.fetchVkyc();
  },
  methods: {
    async vkyc(){
      try{
        const vkycResult = await this.$axios.post('/m2p/vkyc/vcipid');
        if (vkycResult && vkycResult.data.data){
          window.open(vkycResult.data.data.vcip_link,'_blank');
        }
        if (vkycResult.data.data===undefined){
          const response = await this.$axios.post('/m2p/vkyc')
          if (response.data.message==='Success'){
            window.open(response.data.data.vciplink,'_blank');
          }else{
            this.$toast.error('Failed to generate link')  
          }
        }
      }catch(err){
        console.log(err)
        this.$toast.error('Failed')
      }
    },
    async fetchVkyc(){
      try{
      const vkycResult = await this.$axios.post('/m2p/vkyc/vcipid');
        if (vkycResult && vkycResult.data.data){
          const status = vkycResult.data.data.status
          if (status==="COMPLETED"){
           this.vkycMessage = 'COMPLETED'
          }
          if (status === "PENDING"){
           this.vkycMessage = "PENIDNG"
          }
        }
      }catch(err){
        console.log(err)
        this.$toast.error('Failed')
      }
    },
    openRegistrationModal() {
      this.$FModal.show({ component: M2PRegistration })
    },
    openCardSetting() {
      this.$FModal.show({ component: SetPreference })
    },
    openCardBlock() {
      this.$FModal.show({ component: BlockCard }, { revert: this.revertLKUL })
    },
    openCardUnblock() {
      this.$FModal.show({ component: UnblockCard }, { revert: this.revertLKUL })
    },
    openCardPIN() {
      this.$FModal.show({ component: SetPIN })
    },
    async fetchCards() {
      this.isLoading = true;
      try {
        const cardList = await this.$axios.get(`/m2p/cards/list`);
        if (cardList.data.length > 0) {
          this.isCardAvailable = true;
          this.card = cardList.data[0];
          this.isCardBlocked = this.card.cardStatusList.toUpperCase() === 'LOCKED'
          const result2 = await this.$axios.get(`/m2p/cards`);
          this.card.kit_number = result2.data ? result2.data.kit_number : '';
          this.card.url = result2.data ? result2.data.result : '';
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        // this.$toasted.error('Failed to fetch cards');
      }
    },
    toggleCardStatus() {
      if (this.isCardBlocked) {
        this.openCardBlock();
      } else {
        this.openCardUnblock();
      }
    },
    revertLKUL() {
      this.isCardBlocked = !this.isCardBlocked
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
</style>
