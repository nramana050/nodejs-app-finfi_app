<template lang="pug">
div.flex.flex-col
  div.flex-0
    PageHeader(:title="'Dashboard'")
  div(v-if="accounts.length > 0 && organization")
    div.flex-0.p-4
      AccountCard(:accounts="accounts" :provider="organization")
    div.p-4
      p.uppercase.py-4.font-bold.tracking-wider Transfer to my bank account
      div.relative
        input.h-12.pl-5.rounded.z-0.border.border-purple-100.w-full(class="focus:shadow focus:outline-none" type="number" placeholder="Enter amount" v-model="requestedAmount")
        div.absolute.top-0.right-0(v-if="requestedAmount > 0")
          button.h-12.w-24.text-white.rounded.bg-purple-700.uppercase.font-bold(@click="initCashRequest")
            span(v-if="inProgress")
              LoadingIcon.w-6.h-6.text-white.mx-auto
            span(v-else) Send
    div.p-4
      p.uppercase.py-4.font-bold.tracking-wider Bank Transfer Status
      div.flex.flex-col.p-4.rounded-md.shadow-md.w-full.bg-gray-50
        div.flex.flex-row.justify-between(v-if="recentTransaction")
          div
            p.text-xs {{ this.$dayjs(recentTransaction.requested_on).format('YYYY-MM-DD HH:mm:ss') }}
            p.font-thin.text-lg &#8377; {{ parseFloat(recentTransaction.requested_amount).toFixed(2) }}
          div.self-center
            div.text-xs.tracking-wide.inline-flex.items-center.leading-sm.font-bold.uppercase.px-3.py-1.bg-green-200.text-green-700.rounded-full {{ recentTransaction.status }}
        p(v-else) No cash request found. You can raise a cash request and get money in your account 
</template>

<script>
export default {
  name: 'DashboardPage',
  layout: 'session',

  data() {
    return {
      organization: null,
      accounts: [],
      requestedAmount: null,
      recentTransaction: null,
      inProgress: false
    }
  },

  async fetch() {
    await this.getAccountDetails()
  },

  mounted() {
    this.organization = this.$store.getters.organization
  },

  methods: {
    async getAccountDetails() {
      try {
        const promiseArray = [];
        promiseArray.push(this.$axios.get('/accounts?type=CASH'));
        promiseArray.push(this.$axios.get('/accounts?type=CARD'));
        promiseArray.push(this.$axios.get('/accounts?type=PAYABLE'));
        const result = await Promise.all(promiseArray);
        this.accounts = [];
        for (const item of result) {
          const { data } = item;
          this.accounts.push(data);
        }
        await this.fetchRecentWithdrawal();
      } catch (err) {
        this.$toast.error('Failed to fetch accounts');
      }
    },
    async initCashRequest() {
      this.inProgress = true;
      const cashAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === 'CASH' );
      const availableLimit = cashAccount[0].account_balance;
      if (this.requestedAmount > availableLimit) {
        this.$toast.error(`Cash limit available: ${availableLimit}`);
        this.inProgress = false;
        return;
      }
      try {
        const bankResult = await this.$axios.get('/profile/banks');
        // eslint-disable-next-line camelcase
        const { ifsc_code, account_balance } = bankResult.data;
        // eslint-disable-next-line camelcase
        if (ifsc_code === '' || account_balance === '') {
          this.inProgress = false;
          this.$toasted.error('you have missing bank details. Pls update bank details in the profile menu')
          return;
        }
        await this.$axios.post(`/accounts/${cashAccount[0].id}/withdrawals`, {
          amount: this.requestedAmount 
          });
        this.$toast.success('Cash request accepted');
        this.getAccountDetails();
        this.fetchRecentWithdrawal();
        this.requestedAmount=null;
        this.inProgress = false;
      } catch (err) {
        this.inProgress = false;
        this.$toasted.error(err.response.data.message)
      }
    },
    async fetchRecentWithdrawal() {
      const cashAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === 'CASH' );
      try {
        const result = await this.$axios.get(`/accounts/${cashAccount[0].id}/withdrawals?limit=1`);
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
