<template lang="pug">
div.flex.flex-col.p-8#window
  div(v-if="isLoading")
    img#loader(src="~/assets/loader.gif")
  div(v-else)
    p.ps-18.font-bold.tracking-wide.uppercase.pb-5.underline Preferences
    div.flex.justify-between.pb-4.ps-18
      div.miam.miam-active ECOM
      div.text-sm.ps-22 {{ this.form.ecom? 'On' : 'Off' }}
      div.relative.inline-block.w-10.mr-2.align-middle.select-none.transition.duration-200.ease-in
        input.btn.toggle-checkbox.absolute.block.w-6.h-6.rounded-full.border-4.appearance-none.cursor-pointer(type="checkbox" name="ecom" id="ecom" v-model="form.ecom" @change="toggleStatus('ecom')")
        label.toggle-label.block.overflow-hidden.h-6.rounded-full.bg-white.cursor-pointer( for="ecom")
    div.flex.justify-between.pb-4.ps-18
      div.miam.miam-active POS
      div.text-sm.ps-21 {{ this.form.pos? 'on' : 'off' }}
      div.relative.inline-block.w-10.mr-2.align-middle.select-none.transition.duration-200.ease-in
        input.btn.toggle-checkbox.absolute.block.w-6.h-6.rounded-full.border-4.appearance-none.cursor-pointer(type="checkbox" name="pos" id="pos" v-model="form.pos" @change="toggleStatus('pos')")
        label.toggle-label.block.overflow-hidden.h-6.rounded-full.bg-white.cursor-pointer( for="pos")
    div.flex.justify-between.pb-4.ps-18
      div.miam.miam-active Contactless
      div.text-sm.ps-20 {{ this.form.contactless? 'on' : 'off' }}
      div.relative.inline-block.w-10.mr-2.align-middle.select-none.transition.duration-200.ease-in
        input.btn.toggle-checkbox.absolute.block.w-6.h-6.rounded-full.border-4.appearance-none.cursor-pointer(type="checkbox" name="contactless" id="contactless" v-model="form.contactless" @change="toggleStatus('contactless')")
        label.toggle-label.block.overflow-hidden.h-6.rounded-full.bg-white.cursor-pointer( for="contactless")
    //- div.divide-y
    //- div.flex.flex-row.justify-between.pt-4.pr-4
    //-   button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold.w-full(@click="close") Cancel
      //- button.h-8.px-4.text-white.rounded.bg-primary.font-bold(@click="confirm") Save
</template>

<script>
export default {
  name: 'SetPreference',

  data() {
    return {
      isLoading: true,
      form: {
        ecom: true,
        pos: true,
        contactless: true,
      },
    }
  },

  async beforeMount() {
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

  methods: {
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
  },
}
</script>

<style scoped>
#window {
  z-index: 999;
}
.ps-18 {
  margin-top: 0.5rem;
  margin-left: -2rem;
}
.btn {
  background-color: #7165e3;
}
.ps-20 {
  margin-right: -5.8rem;
}
.ps-21 {
  margin-right: -10.5rem;
}
.ps-22 {
  margin-right: -9.8rem;
}
</style>
