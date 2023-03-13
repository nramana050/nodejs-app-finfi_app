<template lang="pug">
div.claim-item(@click="()=>onClaimSelect(claimData?.id)")
    div.header
        div.sub-header
            span Ref Id:
            span {{ claimData?.claim_ref_id }}
        div.sub-header
            span Amount &#8377;  {{claimData?.total_claim_amount}} 
            span.status.approved  {{claimData?.status}}
        div.header-content
            span Claimed On 
            span {{ formatDate(this.claimData?.created_at) }} 
    div.content.p-3(v-if="selectedClaim")
        div.amt-status
            //- span Approved Amount &#8377;  6000
        div.amt-mode 
            div.settle-container(v-if="claimDetails?.reimbursement?.length>1" v-for="reimb in claimDetails?.reimbursement") 
             span &#8377; {{ reimb?.amount }} setteled in {{reimb?.account_type}} Account
             span {{formatDate(reimb?.date)}} 
            div.settle-container(v-else) 
                span Setteled Amount &#8377; {{claimDetails?.reimbursement?.[0].amount}}
                span {{formatDate(claimDetails?.reimbursement?.[0].date)}}
        div.comments 
            span.edit-claim(@click.stop="openBlockCard") Edit Claim
            span.view-conv(@click.stop.prevent="onToggleConversation") coversation {{ isConversationEnabled ? '(-)' : '(+)' }} 
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
                        div.msg-bubble.img-type(v-if="supplement?.document?.length" v-for="doc in supplement?.document")
                            div.msg-text
                              img(:src="doc?.doc_url" crossorigin="anonymous")   
                    
                    //- div.msg.right-msg
                    //-     div.msg-img(style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)")
                    //-     div.msg-bubble
                    //-         div.msg-info
                    //-             div.msg-info-name Sajad
                    //-             div.msg-info-time 12:46
                    //-         div.msg-text You can change your name in JS section!    
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
  },
  data() {
    return {
      selectedClaim: false,
      claimDetails: null,
      claimDate: '',
      isClaimDetailFetched: false,
      isConversationEnabled: false,
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
          claimAmt: this.claimDetails?.summary?.total_claim_amount,
          totalTransactionAmount: this.claimData?.total_transaction_amount,
          selectedTransactions:
            this.claimDetails?.transactions?.map(
              (trans) => trans.transaction_id
            ) || [],
        }
      )
    },
    close() {
      this.$FModal.hide()
    },
    onToggleConversation() {
      this.isConversationEnabled = !this.isConversationEnabled
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
      console.log('CLAIM DETAILS', res)
      if (res?.status) {
        this.claimDetails = res?.claimDetails
        this.isClaimDetailFetched = true
      }
    },
  },
}
</script>
<style scoped>
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
  margin-bottom: 10px;
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
  width: 100px;
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
