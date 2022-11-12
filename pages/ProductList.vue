<template lang="pug">
    div
      div.flex.flex-row.text-white.border.p-4.items-center.ps-13
        button(@click="navToCategory")
          FaIcon.mx-auto.ps-12(icon='angle-left')
        h3.text-sm.font-bold.tracking-widest.uppercase Shop from your favourite brands
      div(v-if="this.productList.length !== 0")
        div.flex.flex-row.mt-4.text-sm.items-center.shadow.ps-3(v-for="item in this.productList" :key="item.id" @click="navToStartPlan() ; selectProduct(item)")
          div.col-1
            div.ps-5.uppercase.font-bold {{item.product_name}}
            div.ps-5 Get Upto {{item.merchant_discount}}% offers
          div.col-2
            span.ps-5.font-bold {{item.product_image}}
        //- div.col-1(@click.stop)
        //-   div.relative.pt-1
        //-     label.form-label(for='customRange1') Example range
        //-     input#customRange1.form-range.appearance-none.w-full.h-6.p-0.bg-transparent(type='range' class='focus:outline-none focus:ring-0 focus:shadow-none' min="0" max="100" v-model="slidervalue")
      div.flex.flex-row.mt-4.text-sm.items-center.shadow.ps-3(v-if="this.productList.length == 0")
        div.ps-4 No Products found  

</template>
<script>
export default {
  name: 'MerchantScreen',
  layout: 'empty',
  data() {
    return {
      productList: [],
      slidervalue: 5,
      selectedProduct: [],
      selected: false,
    }
  },
  computed: {
    selectedCategory() {
      return this.$store.state.snbl.category
    },
  },
  mounted() {
    this.getProducts()
    this.$emit('product', this.selectProduct)
  },

  methods: {
    navToStartPlan() {
      this.$router.push('/StartPlan')
    },
    navToCategory() {
      this.$router.push('/CategoriesScreen')
    },

    selectProduct(Product) {
      this.selectedProduct = []
      this.selectedProduct.push(Product)
      this.selected = true
      this.$store.commit('setProduct', Product)
    },
    getProducts() {
      const payload = { category: [this.selectedCategory] }
      this.$axios.$post(`/snbl/products`, payload).then((result) => {
        this.productList = result.data
      })
    },
  },
}
</script>
<style scoped>
.ps-3 {
  text-align: center;
  background-color: white;
  height: 20vh;
  margin: 2rem;
  border-radius: 15px;
}

.ps-2 {
  background-color: white;
  color: black;
  text-align: center;
}

.ps-4 {
  margin: 6rem;
}

.col-1 {
  height: 20vh;
  width: 50%;
  background-color: #7165e3;
  color: white;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.col-2 {
  height: 20vh;
  width: 50%;
  color: black;
  background-color: rgb(201, 194, 194);
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  display: flex;
  align-items: center;
}

.ps-5 {
  padding: 15px;
}
.ps-12 {
  margin-left: 1rem;
  margin-right: 1rem;
  color: white;
}
.ps-13 {
  background-color: #7165e3;
}
</style>
