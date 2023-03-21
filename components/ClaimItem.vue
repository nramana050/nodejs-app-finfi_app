<template lang="pug">
div.claim-item
    div.header(@click="()=>onClaimSelect(claimData?.id)")
        div.sub-header  
            span
            span(:class="claimData?.status.toLowerCase()") {{claimData?.status}}
        div.sub-header
            span Ref Id
            span {{ claimData?.claim_ref_id }}
        div.sub-header
            span Amount 
            span &#8377;  {{claimData?.total_claim_amount}} 
        div.sub-header
              span Claimed On 
              span {{ formatDate(this.claimData?.created_at) }} 
        div.sub-header
              span Last Updated On 
              span {{ formatDate(this.claimData?.updated_at) }} 
    div.content.p-3(v-if="selectedClaim && !disableActions")
        div.claim-edit-action 
            span.edit-claim(v-if="claimData?.status === 'NEW'|| claimData?.status ==='RESUBMITTED' || claimData?.status==='RETURNED'" @click.stop="openBlockCard") Edit Claim
        div.comments 
            span.view-conv(v-if="claimDetails?.reimbursement?.length>0" @click.stop.prevent="onToggleReimbursement") Reimbursement {{ isReimbursementEnabled ? '(-)' : '(+)' }} 
        div.amt-mode(v-if="isReimbursementEnabled")
            div.settle-container( v-for="reimb in claimDetails?.reimbursement") 
             span &#8377; {{ reimb?.reimbursed_amount }} setteled in {{reimb?.account_type}} Account  
        div.comments 
            span.view-conv(@click.stop.prevent="onToggleTransaction") Transactions {{ isTransactionEnabled ? '(-)' : '(+)' }} 
        div(class="overflow-x-auto transaction-container" v-if="isTransactionEnabled")
          table(class="table-auto min-w-full text-left text-sm font-light")
            thead(class="border-b font-medium dark:border-neutral-500")
              tr
                th(scope="col" class="px-2 py-2") Comment   
                th(scope="col" class="px-2 py-2 min-w-50") Amount(&#8377;)
                th(scope="col" class="px-2 py-2") Date (dd/mm/yyyy)
            tbody
              tr(class="border-b dark:border-neutral-500" v-for="transaction in claimDetails?.transactions")
                td(class="whitespace-nowrap px-2 py-2 font-medium") {{ transaction.transaction_comments }}  
                td(class="whitespace-nowrap px-2 py-2 font-medium") {{ transaction.transaction_amount }} 
                td(class="whitespace-nowrap px-2 py-2 font-medium") {{ formatDate(transaction.transaction_time) }}   
        div.comments 
            span.view-conv(@click.stop.prevent="onToggleConversation") Conversation {{ isConversationEnabled ? '(-)' : '(+)' }} 
        div.msg-container(v-if="isConversationEnabled")    
            section.msger
                main.msger-chat
                    div(v-for="supplement in claimDetails?.supplement" :class="supplement.added_by_user_type === 'USER' ? 'msg left-msg' : 'msg right-msg'")
                        //- div.msg-img(style="background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)")
                        div.msg-bubble
                            div.msg-info
                                div.msg-info-name {{supplement.added_by_user_type}}
                                div.msg-info-time {{formatDateTime(supplement.added_at)}}
                            div.msg-text {{supplement.comment}}
                                div.supportive-docs(v-if="supplement?.document?.length")
                                  LightBox(:imagesData="supplement?.document.map((doc) => ({src: doc.doc_url,crossorigin: 'anonymous',}))")
                                         
</template>

<script>
import moment from 'moment'
import EditClaimForm from '~/components/EditClaimForm.vue'
export default {
  name: 'ClaimItem',
  props: {
    claimData: {
      type: Object,
      required: true,
    },
    refetch: {
      type: Function,
      required: true,
    },
    disableActions: {
      type: Boolean,
    },
  },
  data() {
    return {
      selectedClaim: false,
      claimDetails: null,
      claimDate: '',
      isClaimDetailFetched: false,
      isReimbursementEnabled: false,
      isConversationEnabled: false,
      isTransactionEnabled: false,
    }
  },
  mounted() {},
  watch: {},
  methods: {
    openBlockCard() {
      this.$FModal.show(
        {
          component: EditClaimForm,
        },
        {
          claimDetails: this.claimData,
          accountId:
            this.claimDetails?.summary?.preferred_reimbursement_account_id,
          accountType:
            this.claimDetails?.summary?.preferred_reimbursement_accounty_type,
          claimAmt: this.claimDetails?.summary?.total_claim_amount,
          totalTransactionAmount: this.claimData?.total_transaction_amount,
          selectedTransactions:
            this.claimDetails?.transactions?.map(
              (trans) => trans.transaction_id
            ) || [],
          editReset: this.editReset,
        }
      )
    },
    close() {
      this.$FModal.hide()
    },
    onToggleConversation() {
      this.isConversationEnabled = !this.isConversationEnabled
    },
    onToggleTransaction() {
      this.isTransactionEnabled = !this.isTransactionEnabled
    },
    onToggleReimbursement() {
      this.isReimbursementEnabled = !this.isReimbursementEnabled
    },
    formatDate(d) {
      if (d) {
        return moment(d).format('DD/MM/yyyy')
      }
    },
    formatDateTime(d) {
      if (d) {
        return moment(d).format('DD/MM/yyyy HH:MM')
      }
    },
    onClaimSelect(claimId) {
      if (!this.selectedClaim && claimId && !this.claimDetails) {
        this.fetchClaimDetails(claimId)
      }
      this.selectedClaim = !this.selectedClaim
    },

    async fetchClaimDetails(claimId) {
      const res = await this.$axios.$get(
        `/api/coprx/claim?claimid=${claimId}`,
        {
          headers: {
            Authorization: this.token,
          },
        }
      )
      // console.log('CLAIM DETAILS', res)
      if (res?.status) {
        this.claimDetails = res?.claimDetails
        this.isClaimDetailFetched = true
      }
    },
    async editReset() {
      await this.refetch()
      // console.log('THIS SELECTED CLAIM::', this.claimDetails)
      await this.fetchClaimDetails(this.claimDetails?.summary?.id)
    },
  },
}
</script>
<style scoped>
.claim-edit-action {
  display: flex;
  justify-content: flex-end;
}
.rejected {
  color: red;
  font-weight: bold;
}
.approved {
  color: green;
  font-weight: bold;
}
.on_hold,
.returned {
  color: orange;
  font-weight: bold;
}
.resubmitted,
.new {
  color: #4d4de5;
  font-weight: bold;
}
.settle-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.claim-history-filters {
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding: 5px;
}
.claim-item {
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  margin-bottom: 13px;
}
.claim-item .header {
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
}
.claim-item .header .sub-header,
.claim-item .header .header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.claim-item .header .sub-header .status.approved {
  color: green;
}
.claim-item .header .sub-header .status.rejected {
  color: red;
}
.claim-item .header .sub-header .status.review {
  color: orange;
}
.claim-item .content > div {
  margin-bottom: 10px;
  font-size: 14px;
}
.claim-item .content > div.amt-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 5px;
}
.claim-item .content > div.amt-mode {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 5px;
}
.comments {
  display: flex;
  justify-content: space-between;
}
.view-conv,
.edit-claim {
  text-decoration: underline;
  color: #579ffb;
  cursor: pointer;
}
.msg-container {
  display: flex;
  justify-content: center;
  align-items: center;

  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: Helvetica, sans-serif;
}
.msger {
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  width: 100%;
  max-width: 867px;
  height: calc(100% - 50px);
  border: 2px solid #ddd;
  border-radius: 5px;
  background: #fff;
  max-height: 250px;
}

.msger-chat {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
.msger-chat::-webkit-scrollbar {
  width: 6px;
}
.msger-chat::-webkit-scrollbar-track {
  background: #ddd;
}
.msger-chat::-webkit-scrollbar-thumb {
  background: #bdbdbd;
}
.msg {
  /* display: flex; */
  align-items: flex-end;
  margin-bottom: 10px !important;
}
.msg-bubble.img-type > div {
  display: flex;
  justify-content: center;
}
.msg-bubble.img-type img {
  height: 100px;
  width: 100px;
}
.msg:last-of-type {
  margin: 0;
}
.msg-img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  background: #ddd;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
}
.msg-bubble {
  max-width: 450px;
  padding: 15px;
  border-radius: 15px;
  background: #ececec;
  margin-bottom: 10px !important;
}
.msg-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.msg-info-name {
  margin-right: 10px;
  font-weight: bold;
}
.msg-info-time {
  font-size: 0.85em;
}

.left-msg .msg-bubble {
  border-bottom-left-radius: 0;
}

.right-msg {
  flex-direction: row-reverse;
}
.right-msg .msg-bubble {
  background: #579ffb;
  color: #fff;
  border-bottom-right-radius: 0;
}
.right-msg .msg-img {
  margin: 0 0 0 10px;
}

.msger-inputarea {
  display: flex;
  padding: 10px;
  border-top: 2px solid #ddd;
  background: #eee;
}
.msger-inputarea * {
  padding: 10px;
  border: none;
  border-radius: 3px;
  font-size: 1em;
}
.msger-input {
  flex: 1;
  background: #ddd;
}
.msger-send-btn {
  margin-left: 10px;
  background: rgb(0, 196, 65);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.23s;
}
.msger-send-btn:hover {
  background: rgb(0, 180, 50);
}

.msger-chat {
  background-color: #fcfcfe;
}
</style>
