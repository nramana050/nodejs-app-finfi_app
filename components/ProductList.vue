<template lang="pug">
  div
    div.ps-5
      div.ps-2(v-for="item in this.productList" :key="item.product.id" @click="navToStartPlan(); selectProduct(item)")
        div.ps-3.justify-center
          img.ps-5.h-20.w-50(:src='item.product.product_image')
        div.ps-4
          div.text-xs.ps-4A.font-bold {{item.product.product_name}}
          div.font-bold.text-sm.ps-4B Save for {{item.product.product_name}} products
          div.text-sm Bonus reward Upto {{item.product.merchant_discount}}%
      div.flex.ps-4.items-center.justify-center(v-if="!productList.length") No Products Found for Selected Category      

</template>
<script>
export default {
  props: {
    productList: {
      type: [],
      required: true,
    },
  },
  data() {
    return {
      selectedProduct: [],
      selected: false,
      selectedCategory: null,
    }
  },
  computed: {
    //   selectedCategory() {
    //   return this.$store.state.snbl.category
    // },
  },
  mounted() {
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
.ps-2 {
  height: 15rem;
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
}

.ps-4 {
  height: 5rem;
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
