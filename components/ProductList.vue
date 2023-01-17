<template lang="pug">
  div
    div.ps-5
      div.ps-2(v-for="item in this.productList" :key="item.product.id" @click="navToStartPlan(); selectProduct(item)")
        div.ps-3.d-flex.justify-center
          img(v-if="item.product.product_image" :src='baseUrl+item.product.product_image' crossorigin="anonymous")
          img.custom-img(v-else :src='baseUrl+selectedCategory.category_image' crossorigin="anonymous")
        div.ps-4
          div.text-xs.ps-4A.font-bold {{item.product.product_name}}
          div.font-bold.text-sm.ps-4B Save for {{item.product.product_name}} products
          div.text-sm Discount of {{item.product.merchant_discount}}%
      div.flex.ps-4.items-center.justify-center(v-if="!productList.length") No Products Found for Selected Category      

</template>
<script>
export default {
  props: {
    selectedCategory: {
      required: true,
    },
    productList: {
      type: [],
      required: true,
    },
  },
  data() {
    return {
      selectedProduct: [],
      selected: false,
      baseUrl: this.$axios.defaults.baseURL,
    }
  },
  computed: {
    //   selectedCategory() {
    //   return this.$store.state.snbl.category
    // },
  },
  mounted() {
    console.log('SELECTED CATEGORY::', this.selectedCategory)
    this.$emit('product', this.selectProduct)
  },
  methods: {
    navToStartPlan() {
      this.$router.push('/StartPlan')
    },
    selectProduct(Product) {
      this.selectedProduct = []
      this.selectedProduct.push(Product)
      this.selected = true
      this.$store.commit('setProduct', Product)
    },
  },
}
</script>
<style scoped>
.custom-img {
  height: 120px;
}
.ps-2 {
  margin: 2rem;
  border-radius: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.ps-3 {
  height: 9rem;
  border: 1px solid black;
  padding: 5px;
  border-radius: 15px;
  align-items: center;
  border: 1px solid #979797;
  display: flex;
}
.ps-3 img{
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.ps-4 {
  text-align: left;
  padding: 5px;
  margin-left: 1rem;
}

.ps-4A {
  color: #979797;
}

.ps-4B {
  padding: 5px;
}

.ps-5 {
  margin-bottom: 4rem;
}
</style>
