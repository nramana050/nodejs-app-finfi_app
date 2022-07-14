<template lang="pug">
div.flex.flex-col.p-8#window
  p.font-bold.tracking-wide.uppercase.pb-5 Preferences
  div.flex.justify-between.pb-4
    div.miam.miam-active ECOM
    label.inline-flex.relative.items-center.cursor-pointer(for='default-toggle2')
      input#default-toggle2.sr-only.peer(type='checkbox' v-model="form.ecom" @change="toggleStatus('ecom')")
      .w-11.h-6.bg-gray-200.rounded-full.peer(class="peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600")
      span.ml-3.text-sm.font-medium.text-gray-900(class='dark:text-gray-300')
  div.flex.justify-between.pb-4
    div.miam.miam-active POS
    label.inline-flex.relative.items-center.cursor-pointer(for='default-toggle3')
      input#default-toggle3.sr-only.peer(type='checkbox' v-model="form.pos" @change="toggleStatus('pos')")
      .w-11.h-6.bg-gray-200.rounded-full.peer(class="peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600")
      span.ml-3.text-sm.font-medium.text-gray-900(class='dark:text-gray-300')
  div.flex.justify-between.pb-4
    div.miam.miam-active Contactless
    label.inline-flex.relative.items-center.cursor-pointer(for='default-toggle4')
      input#default-toggle4.sr-only.peer(type='checkbox' v-model="form.contactless" @change="toggleStatus('contactless')")
      .w-11.h-6.bg-gray-200.rounded-full.peer(class="peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600")
      span.ml-3.text-sm.font-medium.text-gray-900(class='dark:text-gray-300')
  div.divide-y
  div.flex.flex-row.justify-between.pt-4.pr-4
    button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold.w-full(@click="close") Cancel
    //- button.h-8.px-4.text-white.rounded.bg-primary.font-bold(@click="confirm") Save
</template>

<script>
export default {
  name: 'SetPreference',

  data() {
    return {
      form: {
        ecom: true,
        pos: true,
        contactless: true
      }
    }
  },

  async mounted() {
    try {
      const result = await this.$axios.$get('/m2p/cards/preferences', {
        headers: {
          'Authorization': this.token
        }
      });
      const data = result.result;
      this.form.ecom = data.ecom;
      this.form.pos = data.pos;
      this.form.contactless = data.contactless;
    } catch (err) {
      // this.$toast.error('Failed')
    }
  },

  methods: {
    close() {
      this.$FModal.hide();
    },
    async toggleStatus(key) {
      this.form[key] = !!this.form[key];
      const payload = {};
      payload[key] = this.form[key];
      try {
        await this.$axios.$post('/m2p/cards/preferences', payload, {
          headers: {
            'Authorization': this.token
          }
        });
      } catch (err) {
        this.$toast.error('Failed')
      }
      // this.close();
    },
  }
}
</script>

<style scoped>
#window {
  z-index: 999;
}
</style>