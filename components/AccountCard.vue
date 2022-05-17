<template lang="pug">
  div.flex.flex-col.p-4.rounded-md.shadow-md.w-full.bg-gradient-to-tr.from-green-800.to-teal-500.text-white
    div
      p.tracking-wider.uppercase.font-bold {{ user.first_name }} {{ user.last_name }}
      p.tracking-wide.text-md {{ provider.name }}
    div.pt-8
      p.tracking-wide.text-sm Available Balance
      p.font-bold.tracking-wider.text-xl &#8377; {{ parseFloat(account.balance).toFixed(2) }}
</template>

<script>
export default {
  props: {
    account: {
      type: Object,
      required: true
    },
    provider: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      user: this.$auth.user,
    }
  },
}
</script>