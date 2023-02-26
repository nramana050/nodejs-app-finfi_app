<template lang="pug">
    div
      div
        HeaderComponent(:title="'Past Plans'")
      div.flex.text-sm.items-center.ps-3(v-for="item in this.PastPlans" :key="item.id")
        div.col-1
          div {{item.product_image}}
        div.col-2 
          div.ps-5.uppercase.font-bold {{ item.product_name }}
          div.ps-5
            span.font-bold End Date: {{item.end_date}}
            //- span Status {{item.status}}
      div.flex.flex-row.mt-4.text-sm.items-center.shadow.ps-3(v-if="PastPlans.length==0")
        div.ps-4 No Plans found

</template>
<script>
import moment from 'moment'
export default {
  name: 'PastPlans',
  layout: 'empty',
  data() {
    return {
      PastPlans: [],
    }
  },
  mounted() {
    this.getPastPlans()
  },

  methods: {
    navToSaveNow() {
      this.$router.push('/shopnow')
    },
    getPastPlans() {
      const payload = { status: ['CLOSED'] }
      this.$axios.$post(`/snbl/orders`, payload).then((result) => {
        this.PastPlans = result.data
        this.PastPlans.forEach((element) => {
          element.end_date = moment(element.end_date).format('DD/MM/YYYY')
        })
      })
    },
  },
}
</script>
<style scoped>
.ps-3 {
  text-align: center;
  background-color: white;
  height: 12vh;
  margin: 1rem;
  border-radius: 7px;
  color: #1c1939;
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
  text-align: center;
  background-color: rgb(201, 194, 194);
}
.col-2 {
  height: 12vh;
  width: 100%;
}
.ps-5 {
  padding: 3px;
}
</style>
