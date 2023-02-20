<template lang="pug">
  div
    div.ps-5
      div.ps-2(v-for="item in this.productList" :key="item.product.id" @click="navToStartPlan(); selectProduct(item)")
        div.ps-3.d-flex.justify-center
          img(v-if="item.product.product_image" :src='baseUrl+item.product.product_image' crossorigin="anonymous")
          img.custom-img(v-else :src='baseUrl+selectedCategory.category_image' crossorigin="anonymous")
        div.ps-4
          div.font-bold.text-sm.ps-4B {{item.product.product_name}}
          div.text-sm.ps-4B.custom-info-container 
           img.custom-icon(src='~/assets/discount.svg')
           span Discount of {{item.product.merchant_discount}}%
          div.text-sm.ps-4B.custom-product-info
          div.custom-info-container
           img.custom-icon(src='~/assets/rupee.svg')
           span {{item.product.acceptance_mode === "BOTH"? 'Online & Store Purchase' : item.product.acceptance_mode === "OFFLINE"? 'Store Purchase': 'Online' }} 
          div.custom-info-container.custom-f-r 
           img.custom-icon(src='~/assets/validity.svg')
           span Valid till {{item.product.validity}}

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
.custom-icon {
  height: 15px;
  width: 15px;
  margin: 0;
  margin-right: 5px !important;
}
.custom-product-info {
  font-size: 12px;
}
.custom-info-container {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
.custom-f-r {
  float: right;
}
.custom-img {
  height: 120px;
}
.ps-2 {
  margin: 1rem;
  border-radius: 5px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.ps-3 {
  height: 9rem;
  border: 1px solid black;
  padding: 5px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  align-items: center;
  border: 1px solid #dbd8d8;
  display: flex;
}
.ps-3 > img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 200px;
  height: 100px;
}

.ps-4 {
  text-align: left;
  padding: 5px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.ps-4A {
  color: #979797;
}

.ps-4B {
  padding-bottom: 5px;
}

.ps-5 {
  margin-bottom: 4rem;
}
</style>
