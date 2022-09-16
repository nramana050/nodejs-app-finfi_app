<template lang="pug">
  div
    div.ps-1
      div(@click="navToDashboard")
        FaIcon.mx-auto.ps-7(icon='angle-left')
      div.grid.text-center
      FaIcon.w-4.h-6.mx-auto.ps-10(icon='building-columns')
      div.ps-2.text-xm.text-center Transfer to your Bank account
      div.ps-3.text-xl.text-center Enter custom amount
      div.flex.flex-row.justify-evenly
        div.text-3xl.ps-6 &#8377;
        input.text-3xl.ps-8(class="focus:outline-none" type="numeric" v-model="requestedAmount")
    div.ps-4
      div(v-if="requestedAmount")
        button.ps-5.font-bold.text-white(@click="initCashRequest")
          span(v-if="inProgress")
            LoadingIcon.w-6.h-6.text-black.mx-auto
          span(v-else) Transfer
      div.ps-9
        FooterLogo
</template>
<script>

  export default{
    name:'TransferScreen',
    layout:'session',
    data() {
    return {
      user: this.$auth.user,
      accounts: [],
      requestedAmount: null,
      recentTransaction: null,
      inProgress: false,
      availableLimit:null,
    }
  },
  async fetch() {
    await this.getAccountDetails()
  },
    methods:{
        navToDashboard() {
          this.$router.push('/dashboard')
        },
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
        const cashAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === 'CASH' );
        const cardAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === 'CARD' );
        this.availableLimit = cashAccount[0].account_balance + cardAccount[0].account_balance
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
        }
    }
   
    
</script>
<style scoped>
    .ps-7{
    color: #FFFFFF;
    margin-left: 2rem;
    width: 20px;
    height: 20px;
    padding-top: 1rem;
  }
  .ps-6{
    margin-left: 30%;
  }
  .ps-4{
    background-color: #FFFFFF;
    height: 30vh;
    margin-top: -5vh;
    padding-top: 20px;
    padding-bottom: 20px;
    border-top-left-radius:15px;
    border-top-right-radius:15px ;
  }
  .ps-1{
    height: 75vh;
    background-color: #7165E3;
    color: #FFFFFF;
  }
  .ps-2{
    margin-top: 2rem;
    
  }
  .ps-5{
    background-color: #7165E3;
    width: 20rem;
    height: 45px;
    font-weight: 500;
    margin-top: 1rem;
    margin-left: 2rem;
    margin-right: 2rem;
    border-radius: 8px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .ps-8{
    background: none;
    border: none;
    width: 50%;
    margin-left: -2rem;
  }
  .ps-9{
    width: 6rem;
    height: 6rem;
    margin-left: 38%;
  }
  .ps-10{
    margin-left: 44%;
    margin-top: 3rem;
    width: 2rem;
    height: 2rem;
    background-color: #FFFFFF;
    color: #1C1939;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 27px;
  }
</style>