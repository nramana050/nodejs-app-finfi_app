<template lang="pug">
div.flex.flex-col
  div.flex-0
    PageHeader(:title="'Dashboard'")
  div.flex-1#dynamicheight(v-if="accounts.length > 0 && organization")
    div.flex-0.p-4
      AccountCard(:accounts="accounts" :provider="organization")
    div.px-4.flex-0
      //- p You are eligible for higher limits, please complete Full VKYC 
      //- p.tracking-wide(v-if="this.vkycMessage==='complete' || this.vkycMessage==='continue'") You are eligible for higher limits, please {{this.vkycMessage}} Full KYC 
      //-   button.w-full.h-10.px-2.text-white.rounded.bg-primary.my-3(@click="vkyc") Complete Full KYC
      p.uppercase.py-4.font-bold.tracking-wider Transfer to my bank account
      div.relative
        input.h-12.pl-5.rounded.z-0.border.border-purple-100.w-full(class="focus:shadow focus:outline-none" type="number" placeholder="Enter amount" v-model="requestedAmount")
        div.absolute.top-0.right-0(v-if="requestedAmount > 0")
          button.h-12.w-24.text-white.rounded.bg-purple-700.uppercase.font-bold(@click="initCashRequest")
            span(v-if="inProgress")
              LoadingIcon.w-6.h-6.text-white.mx-auto
            span(v-else) Send
    div.p-4
      p.uppercase.font-bold.tracking-wider.py-4 Bank Transfer Status
      div.flex.flex-col.p-2.rounded-md.shadow-md.w-full.bg-gray-50
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
      accounts: [],
      requestedAmount: null,
      recentTransaction: null,
      inProgress: false,
      vkycMessage:null,
    }
  },

  async fetch() {
    await this.getAccountDetails()
  },

  computed: {
    organization () {
      return this.$auth.user.organization
    }
  },

  beforeMount() {
    this.fetchVkyc();
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
        this.$toast.success('Cash request sent');
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
    },
    async vkyc(){
      try{
        const vkycResult = await this.$axios.post('/m2p/vkyc/vcipid');
        if (vkycResult && vkycResult.data.data){
          console.log('same link:',vkycResult.data.data.vcip_link)
          window.open(vkycResult.data.data.vcip_link,'_blank');
        }
        if (vkycResult.data.data===undefined){
          const response = await this.$axios.post('/m2p/vkyc')
          if (response.data.message==='Success'){
            console.log('new link:',response.data.data.vciplink)
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
        if (vkycResult && vkycResult.data){
          if(vkycResult.data.message==='Fail' && vkycResult.data.content==='Not registered with M2P'){
            this.vkycMessage = "no message"
          }
          else if(vkycResult.data.data===undefined) this.vkycMessage = "complete"
          
          const status = vkycResult.data.data ? vkycResult.data.data.status:null
          if (status==="COMPLETED"){
           this.vkycMessage = "no message"
          }
          if (status === "PENDING"){
           this.vkycMessage = "continue"
          }
        }
      }catch(err){
        console.log(err)
        this.$toast.error('Failed to vkyc status')
      }
    }
  }
}
</script>

<style scoped>
#dynamicheight {
  margin-bottom: 96px;
}
</style>