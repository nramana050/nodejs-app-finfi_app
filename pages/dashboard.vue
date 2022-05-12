<template lang="pug">
  div.flex.flex-col
    div.flex-0
      PageHeader(:title="'Dashboard'")
    div.flex-0.p-4(v-if="account")
      AccountCard(:account="account")
    div.p-4(v-if="account")
      p.uppercase.py-4.font-bold.tracking-wider Request for Cash
      div.relative
        input.h-12.pl-5.rounded.z-0.border.border-primary.w-full(class="focus:shadow focus:outline-none" type="text" placeholder="Enter amount" v-model="requestedAmount")
        div.absolute.top-0.right-0(v-if="requestedAmount > 0")
          button.h-12.w-24.text-white.rounded.bg-primary.uppercase.font-bold(@click="initCashRequest")
            span(v-if="inProgress")
              LoadingIcon.w-6.h-6.text-white.mx-auto
            span(v-else) Get Cash
    div.p-4
      p.uppercase.py-4.font-bold.tracking-wider Recent Withdrawal 
      div.flex.flex-col.p-4.rounded-md.shadow-md.w-full.bg-gray-50
        div.flex.flex-row.justify-between(v-if="recentTransaction")
          div
            p.text-xs {{ this.$dayjs(recentTransaction.requested_on).format('YYYY-MM-DD HH:mm:ss') }}
            p.font-thin.text-lg &#8377; {{ parseFloat(recentTransaction.requested_amount).toFixed(2) }}
          div.self-center
            TransferredLabel(v-if="recentTransaction.is_approved")
            InProgressLabel(v-else)
        p(v-else) No withdrawals found. You can raise a cash request and get money in your account 
</template>

<script>
export default {
  name: 'DashboardPage',
  layout: 'session',

  data() {
    return {
      organization: this.$store.getters.organization,
      account: null,
      requestedAmount: null,
      recentTransaction: null,
      inProgress: false,
    }
  },

  async fetch() {
    try {
      const account = await this.$axios.get('/accounts');
      const { data } = account;
      if (data) {
        this.account = {
          id: data.id,
          number: data.account_number,
          balance: data.account_balance,
          provider: this.organization.name,
        };
      }
      this.fetchRecentWithdrawal();
    } catch (err) {
      this.$toast.error('Failed to fetch accounts');
    }
  },

  methods: {
    async initCashRequest() {
      this.inProgress = true;
      if (this.requestedAmount > this.account.balance) {
        this.$toast.error('No sufficient balance');
        this.inProgress = false;
        return;
      }
      try {
        await this.$axios.post(`/accounts/${this.account.id}/withdraw`, {
          amount: this.requestedAmount
        });
        this.$toast.success('Cash request accepted');
        this.account.balance = this.account.balance - this.requestedAmount
        this.fetchRecentWithdrawal();
        this.inProgress = false;
      } catch (err) {
        this.inProgress = false;
        this.$toasted.error(err.response.data.message)
      }
    },
    async fetchRecentWithdrawal() {
      try {
        const result = await this.$axios.get(`/accounts/${this.account.id}/withdrawals?limit=1`);
        if (result.data.length > 0) {
          this.recentTransaction = result.data[0]
        }
      } catch (err) {
        this.$toasted.error(err.response.data.message)
      }
    }
  }
}
</script>
