<template lang="pug">
div.flex.flex-col
  div.flex-0
    PageHeader.uppercase(:title="'Claim your Expenses'")
  div.flex.flex-row
    span.ps-2(v-for="tab in tabs" :key="tab.key"
    @click="onTabClick(tab.key)"
    :class="[tabSelected==tab.key ? 'bg-blue-600' : 'bg-white']")
      button {{tab.name}}   
      
  div(v-if="tabSelected=='new_claim'") 
    div.p-2.trans-container
      h2 Select Transactions
      div.transactions
        div.transaction-item(v-for="transaction in transactions"  @click.stop.prevent="()=> onTransactionClick(isTransChecked(transaction?.transaction_id), transaction?.transaction_amount,transaction?.transaction_id)")
          input(type="checkbox" name="transaction" :checked="isTransChecked(transaction?.transaction_id)") 
          div.detail
            span.header {{transaction?.transaction_comments}}
            span.content &#8377; {{ transaction?.transaction_amount }}  
      div.p-2.total-trans-amt 
        span Total 
        span &#8377; {{ totalTransactionSelectedAmt }}
    div.p-2.trans-container.prefmode(v-if="userAccounts?.length>1")
      h2 Prefere Mode
      div.onoffswitch
        input( type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked)
        label.onoffswitch-label(for="myonoffswitch")
          span.onoffswitch-inner
          span.onoffswitch-switch
    ClaimForm(:totalAmount="totalTransactionSelectedAmt" :selectedTransactionIds="selectedTransactions" :reset="this.reset")
    div.p-2.trans-container.disclaimer
     h2 * Disclaimer
     span.content Your fund will be transfered to your preferd mode till settelment limit. If exeeds remaing will go to another mode.

  div(v-if="tabSelected=='claim_history'") 
    div.claim-history-filters.p-2
      span Filter By: 
      select(class="mt-2 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6")
        option Approved  
        option Rejected 
        option Pending  
    div.claim-transactions.p-3(v-if="claims?.length" )
      ClaimItem(v-for="claim in claims" :claimData="claim")
    div.no-data.p-3(v-else) No Claims

</template>

<script>
export default {
  name: 'ClaimSettelment',
  layout: 'session',
  data() {
    return {
      tabs: [
        {
          key: 'new_claim',
          name: 'New Claim',
        },
        {
          key: 'claim_history',
          name: 'Claim History',
        },
      ],
      tabSelected: 'new_claim',
      claims: [],
      isClaimsFetched: false,
      selectedFiles: ['File 1', 'File 2', 'File 3'],
      userAccounts: [],
      preferMode: null,
      transactions: [],
      selectedTransactions: [],
      totalTransactionSelectedAmt: 0,
      transaction: this.$store.getters.new_transaction,
      currentAmount: null,
      comment: null,
      is_corporate_expense_enabled:
        this.$store.getters.is_corporate_expense_enabled,
      documents: 0,
      formData: null,
      details: [],
      limit: -2,
      event: null,
    }
  },
  mounted() {
    this.fetchUserConfig()
    this.fetchTransactions()
  },
  updated() {
    if (
      this.tabSelected === 'claim_history' &&
      !this.claims?.length &&
      !this.isClaimsFetched
    ) {
      this.fetchClaims()
    } else if (this.tabSelected === 'new_claim' && this.isClaimsFetched) {
      this.claims = []
      this.isClaimsFetched = false
    }
  },
  watch: {},
  methods: {
    isTransChecked(id) {
      return this.selectedTransactions.includes(id)
    },
    onTabClick(tabName) {
      this.tabSelected = tabName
    },
    onTransactionClick(isChecked, amt, id) {
      if (!isChecked) {
        this.totalTransactionSelectedAmt += amt
        this.selectedTransactions = [...this.selectedTransactions, id]
      } else {
        this.totalTransactionSelectedAmt -= amt
        this.selectedTransactions = [
          ...this.selectedTransactions.filter((i) => i !== id),
        ]
      }
    },
    cleanFile() {
      if (this.event != null) {
        this.event.target.value = ''
        this.documents = 0
        this.event = null
      }
    },

    async getDetails() {
      const payload = {
        transaction_id: this.transaction.id,
      }

      const response = await this.$axios.$post('/corporate/details', payload, {
        headers: {
          Authorization: this.token,
        },
      })

      this.details = response.details
    },

    async applyCORPEX() {
      const NumberRegex = /^(1|[1-9][0-9]{0,9})$/.test(this.currentAmount)
      let document

      if (this.documents === 0) {
        return this.$toast.error('Please attached your receipt.')
      }

      if (!NumberRegex) {
        return this.$toast.error('Please enter valid amount.')
      }

      if (this.currentAmount > this.transaction.transaction_amount) {
        return this.$toast.error(
          'Request amount is greater than Debited amount.'
        )
      }

      if (this.comment === null || this.comment.length < 10) {
        return this.$toast.error('Please attached your comment.')
      }

      if (this.formData === null) {
        return this.$toast.error('Please upload your document.')
      }

      const files = await this.$axios.post('/corporate/upload', this.formData, {
        headers: {
          'Content-Type': `multipart/form-data`,
          Authorization: this.token,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      })

      if (files.data.status === false) {
        return this.$toast.error(`${files.data.message}`)
      } else {
        document = files.data.filenames.toString()
      }

      const payload = {
        amount: this.currentAmount,
        transaction: this.transaction.id,
        comment: this.comment,
        documents: document,
      }

      const response = await this.$axios.$post('/corporate/request', payload, {
        headers: {
          Authorization: this.token,
        },
      })

      if (response.status === true) {
        this.currentAmount = null
        this.formData = null
        this.documents = 0
        this.comment = null
        this.getDetails()
        this.cleanFile()
        return this.$toast.success(response.message)
      } else {
        return this.$toast.error(response.message)
      }
    },

    previewFiles(event) {
      this.formData = new FormData()
      this.event = event
      if (this.event.length === 0) {
        return this.$toast.info(`${this.documents} file removed.`)
      } else {
        this.documents = this.event.target.files.length
        this.$toast.info(`${this.documents} file Selected.`)
      }
      const imagefiles = this.event.target.files
      if (imagefiles.length > 5) {
        this.cleanFile()
        return this.$toast.info('Upload less then 5 files.')
      }

      for (const file of imagefiles) {
        this.selectedFiles = this.selectedFiles.push(file?.name)
        if (file.size > 1887436.8) {
          this.cleanFile()
          return this.$toast.error('File should be less than 2 mb.')
        }
        this.formData.append(file.name, file)
      }
    },

    async fetchClaims() {
      const res = await this.$axios.$get('/api/coprx/claims', {
        headers: {
          Authorization: this.token,
        },
      })
      console.log('CLAIMS', res)
      if (res?.status) {
        this.claims = res?.claims
        this.isClaimsFetched = true
      }
    },

    async fetchUserConfig() {
      const res = await this.$axios.$get('/api/coprx/userconfig', {
        headers: {
          Authorization: this.token,
        },
      })
      console.log('USER Config', res)
      if (res?.status) {
        this.userAccounts = res?.account
      }
    },

    async reset() {
      this.totalTransactionSelectedAmt = 0
      this.transactions = []
      this.selectedTransactions = []
      this.tabSelected = 'claim_history'
      await this.fetchTransactions()
    },

    async fetchTransactions() {
      const res = await this.$axios.$get(
        '/api/coprx/transactions?claimedstatus=UNCLAIMED',
        {
          headers: {
            Authorization: this.token,
          },
        }
      )
      console.log('TRANSACTIONS', res)
      if (res?.status) {
        this.transactions = res?.transaction_log
      }
    },
  },
}
</script>
<style scoped>
.disclaimer > .content {
  font-size: 14px;
  color: #9c9c9c;
  line-height: 20px;
  display: block;
  text-align: justify;
  padding: 5px;
}
.prefmode {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ps-2 {
  width: 33.3%;
  text-align: center;
  margin-top: 2rem;
  border-bottom: 1px solid #d8d8d8;
  color: #d8d8d8;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
.ps-3 {
  min-height: 100vh;
}
.no-data {
  padding: 30px;
  text-align: center;
  background: #f0f0f0;
}

.trans-container {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 10px;
}
.transactions {
  max-height: 170px;
  overflow-y: scroll;
}
.trans-container .total-trans-amt {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.trans-container h2 {
  margin: 5px 0px;
  font-size: 15px;
}
.transaction-item {
  padding: 5px;
  background: #f0f0f0;
  border-radius: 5px;
  font-size: 13px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
}
.transaction-item > input {
  margin-right: 5px;
}
.transaction-item > .detail {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}

.onoffswitch {
  position: relative;
  width: 100px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.onoffswitch-checkbox {
  display: none;
}
.onoffswitch-label {
  display: block;
  overflow: hidden;
  cursor: pointer;
  border-radius: 20px;
}
.onoffswitch-inner {
  display: block;
  width: 200%;
  margin-left: -100%;
  transition: margin 0.3s ease-in 0s;
}
.onoffswitch-inner:before,
.onoffswitch-inner:after {
  display: block;
  float: left;
  width: 50%;
  height: 30px;
  padding: 0;
  line-height: 30px;
  font-size: 12px;
  color: white;
  font-family: Trebuchet, Arial, sans-serif;
  font-weight: bold;
  box-sizing: border-box;
}
.onoffswitch-inner:before {
  content: 'CASH';
  padding-left: 10px;
  background-color: #02c502;
  color: #ffffff;
}
.onoffswitch-inner:after {
  content: 'CARD';
  padding-right: 10px;
  background-color: #02c502;
  color: #ffffff;
  text-align: right;
}
.onoffswitch-switch {
  display: block;
  width: 46px;
  margin: 2px;
  background: #ffffff;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 50px;
  border-radius: 20px;
  transition: all 0.3s ease-in 0s;
}
.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {
  margin-left: 0;
}
.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
  right: 0px;
}
</style>
