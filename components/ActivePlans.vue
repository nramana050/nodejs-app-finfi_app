<template lang="pug">
   div.ps-1A
      div.flex.text-sm.ps-3(v-for="item in ActivePlans" :key="item.id")
        span.col-1
          img(:src='item.product_image')
        span.col-2 
          div.ps-5.uppercase.font-bold {{ item.product_name}}
          div.ps-5
            span.font-bold.ps-5 Start Date:  {{item.start_date}}
            //- span.text-xs.tracking-wide.inline-flex.items-center.leading-sm.font-bold.uppercase.ps-19.px-3.py-1.bg-green-200.text-green-700.rounded-full {{item.status}}
      div.flex.flex-row.mt-4.text-sm.items-center.shadow.ps-3(v-if="ActivePlans.length==0")
        div.ps-4 No Plans found
</template>
<script>
  import moment from 'moment'

export default {
  data() {
    return {
      ActivePlans: [],
      plans: false,
      StartDate: null,
      EndDate: null,
    }
  },

  mounted() {
    this.getActivePlans()
    //  this.monthsLeft=this.item.start_date.diff(this.item.end_date, 'months')
  },
  methods: {
    navToSaveNow() {
      this.$router.push('/saveNow')
    },
    getActivePlans() {
      const payload = { status: ['ACTIVE'] }
      this.$axios.$post(`/snbl/orders`, payload).then((result) => {
        this.ActivePlans = result.data
        this.ActivePlans.forEach((element) => {
          element.start_date = moment(element.start_date).format('DD/MM/yyyy')
        })
      })
    },
  },
}
</script>
<style scoped>
  .ps-1A{
    margin-bottom: 4rem;
  }
.ps-3 {
  text-align: center;
  background-color: white;
  height: 12vh;
  margin: 1rem;
  border-radius: 7px;
  color: #1c1939;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.ps-2 {
  background-color: white;
  color: black;
  text-align: center;
}
.ps-4 {
  margin-left: 8rem;
}
.col-1 {
  height: 12vh;
  width: 40%;
  color: #1c1939;
  align-items: center;
  display: flex;
}
.col-2 {
  height: 12vh;
  width: 100%;
}
.ps-5 {
  padding: 3px;
}
</style>