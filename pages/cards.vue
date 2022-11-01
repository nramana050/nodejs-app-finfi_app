<template lang="pug">
div
  div
    button(@click="navToDashboard")
        FaIcon.mx-auto.ps-3(icon='angle-left')
    div.text-center.font-bold(v-if="isCardAvailable") Card Details 
    div.text-center.font-bold(v-else) Card is not registered
  div
    div(v-if="isCardAvailable && cardFetch > 0")
      div.ps-8(v-if="card.url && !isCardBlocked")
        object(:data="card.url" width="90%" height="220" type="text/html" style="margin-left: 5%;" css="{ .counter-container { diaplay: none; }}" :key="cardFetch")
      div(v-else)
        div.ps-17
          img#dummycard(src="https://static.thenounproject.com/png/2028787-200.png")
    div.ps-2(v-if="!isCardAvailable && openUnblockCard")
      div
        p Please go through the 
          a.font-bold.text-blue-800(href='https://www.myfinfi.com/t-c-for-app-usage' target="_blank") Terms and Conditions
          //- p.text-xs
          //-   a(href='https://www.myfinfi.com/' target="_blank") *terms and conditions
        input.p-2(v-model="isTermsAccepted" :true-value="true" :false-value="false" type="checkbox")
        label  I accept the terms and condition 
      button.ps-6.h-12.w-full.text-black.rounded.uppercase.font-bold(v-if="this.isTermsAccepted" @click="openRegistrationModal")
        span Get Card
  div.ps-1
    div.ps-16.uppercase(v-if="isCardAvailable")
      div.flex.flex-row.justify-between
        span Card Status
        span.font-bold.uppercase {{ isCardBlocked ? 'BLOCKED' : 'ACTIVE' }}
      div.flex.flex-row.justify-between.ps-19
        span Block card
        div.relative.w-10.h-10
          img(src="~/assets/toggle_on.png" v-if="isCardBlocked" @click="openUnblockCard")
          img(src="~/assets/toggle_off.png" v-else @click="openBlockCard")
    div.uppercase.ps-5(v-if="isCardAvailable")
      SetPreference
        
    //- div.flex.flex-row.justify-between.ps-7
    //-   div.text-sm Ecom 
    //-   span.text-sm {{form.ecom? 'On': 'Off'}}
    //-   div.relative
    //-     img(src="~/assets/toggle_on.png" v-if="form.ecom=true" name="ecom" id="ecom" v-model="form.ecom" @click="toggleStatus('ecom')")
    //-     img(src="~/assets/toggle_off.png" v-if="form.ecom=false" name="ecom" id="ecom" v-model="form.ecom" @click="toggleStatus('ecom')")
        //- div.flex.flex-row.justify-between.ps-15
        //-   div.text-sm POS
        //-   div.relative
        //-     img(src="~/assets/toggle_on.png" v-if="isPos" @click="")
        //-     img(src="~/assets/toggle_off.png" v-else @click="")
        //- div.flex.flex-row.justify-between.ps-15
        //-   div.text-sm Contactless
        //-   div.relative
        //-     img(src="~/assets/toggle_on.png" v-if="isContactLess" @click="")
        //-     img(src="~/assets/toggle_off.png" v-else @click="")
        
  //- div(v-if="isLoading")
  //-   img#loader(src="~/assets/loader.gif")
  //- div(v-else)
  //-   div.flex.flex-col(v-if="isCardAvailable")
  //-     div.flex(v-if="card.url")
  //-       object(:data="card.url" width="90%" height="220" type="text/html" style="margin-left: 5%;" css="{ .counter-container { diaplay: none; }}" :key="cardFetch")
  //-       //- iframe(:src="card.url" width="100%" height="320px")
  //-     div.flex(v-else)
  //-       div(width="100%" style="height:270px !important;")
  //-         img#dummycard(src="https://static.thenounproject.com/png/2028787-200.png")
  //-     div.flex-flex-col.mt-5.bg-gray-100
  //-       div.flex.flex-row.justify-between.py-2.px-8
  //-         span Kit Number
  //-         span.font-bold.uppercase.tracking-wide {{ card.kitList }}
  //-       div.flex.flex-row.justify-between.pb-2.px-8
  //-         span Card Status
  //-         span.font-bold.uppercase.tracking-wide {{ isCardBlocked ? 'BLOCKED' : 'ACTIVE' }}
  //-       div.px-8.bg-white.pt-4
  //-         div.flex.justify-between.is-align-items-center.pb-2
  //-           div.miam.miam-active.pt-2 Block Card
  //-           //- div.relative.inline-block.w-10.mr-2.align-middle.select-none.transition.duration-200.ease-in
  //-           //-   input.toggle-checkbox.absolute.block.w-6.h-6.rounded-full.bg-white.border-4.appearance-none.cursor-pointer(type="checkbox" name="block" id="block" :value="isCardBlocked" @change="toggleCardStatus")
  //-           //-   label.toggle-label.block.overflow-hidden.h-6.rounded-full.bg-gray-300.cursor-pointer( for="block")
  //-           div.relative
  //-             img(src="~/assets/toggle_on.png" v-if="isCardBlocked" @click="openUnblockCard")
  //-             img(src="~/assets/toggle_off.png" v-else @click="openBlockCard")
  //-       div.px-8.bg-white.pt-4
  //-         div.grid.grid-cols-1.divide-y.border.rounded 
  //-           div.flex.justify-between.px-4.py-2(@click="openCardSetting")
  //-             span Card Preferences 
  //-             span &#8250;
  //-           div.flex.justify-between.px-4.py-2(@click="openCardPIN")
  //-             span Set PIN 
  //-             span &#8250;  
  //-   div.flex.flex-col.p-4(v-else)
  //-     div.p-2
  //-       p.p-2 Please go through the 
  //-         a.font-bold.text-blue-800(href='https://www.myfinfi.com/t-c-for-app-usage' target="_blank") Terms and Conditions
  //-         //- p.text-xs
  //-         //-   a(href='https://www.myfinfi.com/' target="_blank") *terms and conditions
  //-       input.p-2(v-model="isTermsAccepted" :true-value="true" :false-value="false" type="checkbox")
  //-       label  I accept the terms and condition 
  //-     button.h-12.w-full.text-white.rounded.bg-primary.uppercase.font-bold(v-if="this.isTermsAccepted" @click="openRegistrationModal")
  //-       span Get Card

</template>

<script>
import M2PRegistration from '~/components/M2P/Registration.vue'
import SetPreference from '~/components/M2P/SetPreference.vue'
import BlockCard from '~/components/M2P/BlockCard.vue'
import UnblockCard from '~/components/M2P/UnblockCard.vue'
import SetPIN from '~/components/M2P/SetPIN.vue'

export default {
  name: 'DashboardPage',
  components: { SetPreference },
  layout: 'empty',
  data() {
    return {
      user: this.$auth.user,
      isLoading: true,
      isCardAvailable: false,
      // isCardBlocked: false,
      // isEcomBlocked: false,
      // isPosBlocked: false,
      isContactLessBlocked: false,
      isEcom: true,
      card: null,
      isTermsAccepted: false,
      cardFetch: 0,
      form: {
        ecom: true,
        pos: true,
        contactless: true,
      },
    }
  },
  mounted() {
    this.fetchCards()
    this.fetchCardPreference()
  },
  methods: {
    navToDashboard() {
      this.$router.push('/dashboard')
    },
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
    close() {
      this.$FModal.hide()
    },
    async toggleStatus(key) {
      this.form[key] = !!this.form[key]
      const payload = {}
      payload[key.toUpperCase()] = this.form[key]
      try {
        await this.$axios.$post('/m2p/cards/preferences', payload, {
          headers: {
            Authorization: this.token,
          },
        })
        this.$toast.success('Preference updated')
      } catch (err) {
        this.$toast.error('Failed')
      }
      // this.close();
    },

    openCardPIN() {
      this.$FModal.show({ component: SetPIN })
    },
    async fetchCardPreference() {
      try {
        const result = await this.$axios.$get('/m2p/cards/preferences', {
          headers: {
            Authorization: this.token,
          },
        })
        const data = result.result
        this.form.ecom = data.ecom
        this.form.pos = data.pos
        this.form.contactless = data.contactless
        this.isLoading = false
      } catch (err) {
        // this.$toast.error('Failed')
      }
    },
    async fetchCards() {
      this.isLoading = true
      try {
        const cardList = await this.$axios.get(`/m2p/cards/list`)
        if (cardList.data.result.length > 0) {
          this.isCardAvailable = true
          this.card = cardList.data.result[0]
          this.isCardBlocked =
            this.card.cardStatusList.toUpperCase() === 'LOCKED'
          await this.fetchCardDetail()
        }
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
        // this.$toasted.error(err.response.data.message);
      }
    },
    async fetchCardDetail() {
      try {
        const result2 = await this.$axios.get(`/m2p/cards`)
        this.cardFetch += 1
        // this.card.kit_number = result2.data && result2.data.result ? result2.data.result.kit_number : '';
        this.card.url =
          result2.data && result2.data.result ? result2.data.result : ''
        setTimeout(async () => await this.fetchCardDetail(), 118000)
      } catch (err) {
        this.cardFetch += 1
      }
    },
    revertLKUL() {
      this.fetchCards()
    },
  },
}
</script>

<style scoped>
/* #dummycard {
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
/* }
object:focus {
  outline: none;
} */
.ps-1 {
  height: 70vh;
  background-color: #7165e3;
  margin-top: -2rem;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.ps-3 {
  padding-top: 2rem;
  margin-left: 2rem;
}
.ps-4 {
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: white;
  color: #1c1939;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top: 2rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.ps-5 {
  color: white;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top: 1rem;
}
.ps-6 {
  margin-top: 5rem;
  background-color: white;
}
.ps-7 {
  margin-top: 2rem;
}
.ps-15 {
  margin-top: 0.5rem;
}

.ps-8{
  margin-left: 0.3rem;
  margin-right: 0.3rem;
  height: 25vh;
}
.ps-17 {
  height: 25vh;
  margin-left: 6rem;
}
.ps-2 {
  margin-left: 1.5rem;
  margin-top: 2rem;
  margin-right: 1.5rem;
  height: 20vh;
}
.ps-9 {
  margin-top: 2.5rem;
  color: grey;
  margin-left: 1rem;
  margin-right: 1rem;
}
.ps-12 {
  margin-top: -1rem;
}
.ps-10 {
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 1rem;
}
.ps-11 {
  margin-left: 1rem;
  padding-top: 2rem;
}
.ps-13 {
  color: #7165e3;
  margin-right: 2rem;
}
.ps-14 {
  margin-top: 3rem;
}
.ps-16 {
  color: white;
  padding-top: 7rem;
  margin-left: 2rem;
  margin-right: 2rem;
}
.ps-19 {
  margin-top: 1rem;
}
</style>
