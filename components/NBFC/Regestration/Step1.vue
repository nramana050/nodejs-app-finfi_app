<template lang="pug">
    div.flex.flex-col
      FormulateForm(v-model="form" @submit="next")
        div
          FormulateInput.pr-3(type="select"  label="Title" name="title" :options="title" placeholder="Select" validation="required")
        div
          FormulateInput.pr-3(type="text" label="First Name" name="first_name" validation="required")
          div
          FormulateInput.pr-3(type="text" label="Middle Name" name="middle_name" )
        div
          FormulateInput.pr-3(type="text" label="Last Name" name="last_name"  validation="required")
        div
          FormulateInput.pb-2.pr-3(type="number" label="Mobile Number" name="mobile"  validation="required")
        div
          FormulateInput.pb-2.pr-3(type="text" label="Email" name="email"  validation="required")
        div
          div.flex-1
            FormulateInput.pr-3(type="select" label="Gender" name="gender" :options="genders" placeholder="Select" validation="required")
          div.flex-1 
            p.p-1 Date Of Birth
            date-picker(v-model="form.dob" valueType="format" placeholder="DOB" :disabled-date="disabledRange" :input-attr="{required: 'true'}")
          div.flex-1
            FormulateInput.pr-3(type="text" label="latitude" name="latitude" validation="required")
          div.flex-1
            FormulateInput.pr-3(type="text" label="longitude" name="longitude" validation="required")

        div.flex.flex-cpl
          div.flex-1.pr-4
            div.flex.flex-row.py-4.justify-between
              button.btn.h-8.px-4.text-white.rounded.font-bold Next
              button.h-8.px-4.text-white.rounded.bg-gray-900.font-bold(@click="cancel") Cancel
    </template>

<script>
export default {
  name: 'Step1Component',

  data() {
    return {
      details: {},
      token: this.$auth.strategy.token.get(),
      form: {
        first_name: '',
        last_name: '',
        middle_name: '',
        mobile: '',
        email: '',
        gender: '',
        dob: '',
        title: '',
        latitude: '',
        longitude: '',
      },
      genders: { M: 'Male', F: 'Female' },
      title: { Mr: 'Mr', Mrs: 'Mrs', Ms: 'Ms' },
    }
  },

  mounted() {
    this.borrowerdetails()
    this.getPosition()
  },
  methods: {
    nameKeydown(e) {
      if (/^\W$/.test(e.key)) {
        e.preventDefault()
      }
    },

    // capture the user geolocation 
    // 
    // 
    getPosition() {
        if (!navigator.geolocation) {
          this.$toast.error('Geolocation API not supported by this browser.')
        } else {
          navigator.geolocation.getCurrentPosition(
            (position)=>{
              this.form.latitude=(position.coords.latitude *10).toString()
              this.form.longitude=(position.coords.longitude *10).toString()
              // alert(this.form.latitude)
            },(error)=>{
              // console.log("The error is from location api",error)
              this.$toast.error(error.message)
            }
          )
          
        }

    },

    async borrowerdetails() {
      const url = 'nbfc/borrower/detail'
      try {
        const response = await this.$axios.$get(url)
        this.details = response.details[0]
        this.form.title = this.details.title
        this.form.mobile = this.details.mobile
        this.form.first_name = this.details.first_name
        this.form.last_name = this.details.last_name
        this.form.email = this.details.email
        this.form.gender = this.details.gender
        this.form.dob = this.details.dob
        this.form.middle_name = this.details.middle_name
        
        // this.form = this.details
      } catch (error) {
        this.$toast.error('')
      }
    },

    async next() {
      const url = '/nbfc/borrower/create'
      const payload = this.form
      try {
        const response = await this.$axios.$post(url, payload)
        // console.log(response.status)
        if (response.status) {
          //  when we get userhasid but already registered
          this.$emit('next')
          // this.$store.commit('setNbfcStatus',"CREATED")
        }
        //  this message is shown when user is registered with nbfc
        // but uher has id is not generated
        else {
          this.$toast.info(response.message)
        }
      } catch (error) {
        this.$toast.error('')
      }
    },
    cancel(e) {
      this.$router.push('/dashboard')
      e.preventDefault()
      // this.$emit('close')
    },
    disabledRange(date) {
      return date > new Date()
    },
  },
}
</script>
<style scoped>
.btn {
  background-color: #7165e3;
}
</style>
