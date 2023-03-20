<template lang="pug">
div.p-3.trans-container
  form(@submit.prevent="createClaim")
        div.form-item(v-if="isDiplayTotalAmount")
          label.block.text-sm.font-medium.leading-6.text-gray-900(for="amount")
            span Total Transaction Amount
             sup.required *
          input(class="p-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="number" id="amount" name="amount" placeholder="Enter your claim amount" :value="totalAmount" disabled)
        div.form-item
          label.block.text-sm.font-medium.leading-6.text-gray-900(for="amount")
            span Claim Amount
             sup.required *
          input(min="1" :max="totalAmount" class="p-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="number" id="amount" name="amount" placeholder="Enter your claim amount" v-model="claimAmount")
        div.form-item
          label.block.text-sm.font-medium.leading-6.text-gray-900(for="comment") 
           span Comment
            sup.required *
          div.mt-2
          textarea(maxlength="100" class="p-2 mt-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6" placeholder="Put your comment" id="comment" name="comment" v-model="user_comment" rows="3" cols="30")
        div.form-item.flex.text-sm.text-gray-600
          label(class="addproofs relative cursor-pointer rounded-md bg-white font-medium text-indigo-600" for="addproofs")
            span(class="inline-flex justify-center rounded-md bg-white py-2 px-3 text-sm font-semibold border border-indigo-600 text-indigo-600 shadow-sm") Upload File(s)
            input(type="file" class="file sr-only" id="addproofs" accept="image/jpeg, image/png" @change="selectLocalFiles($event)" multiple) 
        div(v-if="attachments?.length" v-for="(file, idx) in attachments" :key="idx")
          div.file-item 
            span {{file?.name}}
            span.deleteFile(@click.stop="()=>onDeleteFile(idx)")  
              FaIcon(icon='trash')
        div(class="form-item bg-gray-50 py-3 text-right")   
          button(class="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" type='Submit') {{this.claimDetails?.id ? 'Edit Your Claim' : 'Submit Your Claim'}}  
</template>

<script>
export default {
  name: 'ClaimForm',
  props: {
    isDiplayTotalAmount: {
      type: Boolean,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    selectedTransactionIds: {
      type: Array,
      required: true,
    },
    claimDetails: {
      type: Object,
    },
    reset: {
      type: Function,
    },
    claimAmt: {
      type: Number,
    },
    accountId: {
      type: Number,
      required: true,
    },
    accountType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      claimAmount: this.claimAmt,
      user_comment: '',
      attachments: [],
    }
  },
  async beforeMount() {
    if (this.$auth.strategy.token.status().valid()) {
      const apiResult = await this.$axios.get('/organizations/config', {
        headers: {
          Authorization: this.token,
        },
      })
      if (!apiResult.data?.user?.is_corporate_expense_enabled) {
        this.$router.push('/dashboard')
      }
    }
  },
  methods: {
    onFormclose() {
      this.$FModal.hide()
    },
    async createClaim() {
      if (!this.selectedTransactionIds?.length) {
        return this.$toast.error('Please select transactions to proceed')
      }
      if (!this.claimAmount || this.claimAmount <= 0) {
        return this.$toast.error(
          'Invalid Claim Amount. Claim Amount cannot be 0 or negative.'
        )
      }
      if (+this.totalAmount < +this.claimAmount) {
        return this.$toast.error(
          'Your claim amount cannot be more than total transaction amount.'
        )
      }
      if (!this.user_comment.trim()?.length) {
        return this.$toast.error('Comment cannot empty.')
      }
      if (this.user_comment.trim()?.length > 100) {
        return this.$toast.error('Comment cannot be more than 100 charactes')
      }
      if (!this.attachments?.length && !this.claimDetails?.id) {
        return this.$toast.error('Please attach a supportive document(s).')
      }

      const formData = new FormData()
      formData.append(
        'selected_transaction_ids',
        JSON.stringify(this.selectedTransactionIds)
      )
      formData.append('prefered_account_type', this.accountType)
      formData.append('prefered_account_id', this.accountId)
      formData.append('total_transaction_amount', +this.totalAmount)
      formData.append('claim_amount', +this.claimAmount)
      formData.append('user_comment', this.user_comment.trim())
      if (this.attachments?.length) {
        for (let i = 0; i < this.attachments.length; i++) {
          formData.append('attachments', this.attachments[i])
        }
      }
      try {
        if (this.claimDetails?.id) {
          const res = await this.$axios.$put(
            `/api/coprx/claim?claimid=${this.claimDetails?.id}`,
            formData,
            {
              headers: {
                'Content-Type': `multipart/form-data`,
                Authorization: this.token,
              },
            }
          )
          if (res.status) {
            this.$toast.success(res?.message)
            this.onFormclose()
            this.reset()
          } else {
            this.$toast.error(res?.message)
          }
        } else {
          const res = await this.$axios.$post('/api/coprx/claim', formData, {
            headers: {
              'Content-Type': `multipart/form-data`,
              Authorization: this.token,
            },
          })
          if (res.status) {
            this.$toast.success(res?.message)
            this.reset()
          } else {
            this.$toast.error(res?.message)
          }
        }
        this.claimAmount = 0
        this.user_comment = ''
      } catch (error) {
        console.error(error)
        this.$toast.error(error?.message)
      }
    },
    selectLocalFiles(event) {
      const files = event.target.files
      console.log(event.target.files)
      // if (files.length > 5) {
      //   return this.$toast.error(
      //     'Max 5 files you can select, each file should not be more than 2MB'
      //   )
      // }
      this.attachments = [...this.attachments, ...files]
    },
    onDeleteFile(idx) {
      this.attachments.splice(idx, 1)
    },
  },
}
</script>

<style scoped>
.trans-container {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 10px;
}
.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
}
.file-item .deleteFile {
  cursor: pointer;
  color: #fa4848;
  font-size: 14px;
}
.form-item {
  margin-bottom: 10px;
}

.addproofs,
.addproofs > span {
  width: 100%;
}
.required {
  color: red;
  margin-left: 2px;
}
</style>
