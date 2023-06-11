<template lang="pug">
div
    div.ps-5
      div.container.corp-exp.products.p-2
            div.latest-claim(v-if="productList?.length")
                  div.slide.custom-pro-slide(v-for="product in this.productList" @click="addToCart({ product: product?.product})") 
                    div.slide-header
                      img(:src="baseUrl+product.product.product_image" crossorigin="anonymous")
                    div.slide-content
                      div.product-name {{product.product?.product_name}}
                      div.product-discount Get {{ product.product?.merchant_discount + product.product?.finfi_discount }}% discount
                    div.slide-product-availability
                      span.mode(v-if="product.product?.acceptance_mode === 'ONLINE' || product.product?.acceptance_mode==='BOTH'")
                        img(src="~/assets/myfinfi-icons/online.png")
                        span  Online
                      span.mode(v-if="product.product?.acceptance_mode === 'INSTORE' || product.product?.acceptance_mode==='BOTH'")
                        img(src="~/assets/myfinfi-icons/instore.png")
                        span  In-Store
      div.flex.ps-4.items-center.justify-center(v-if="!productList.length && selectedCategory") No Products Found for Selected Category      
      div.flex.ps-4.items-center.justify-center(v-if="!productList.length && !selectedCategory") No Products Found  
</template>
<script>
export default {
  props: {
    selectedCategory: {},
    productList: {
      type: [],
      required: true,
    },
  },
  data() {
    return {
      selectedProduct: [],
      selected: false,
      baseUrl: 'https://myfinfi-uat-uploads.s3.ap-south-1.amazonaws.com',
    }
  },
  computed: {
    //   selectedCategory() {
    //   return this.$store.state.snbl.category
    // },
  },
  updated() {
    console.log('PRODUCT LIST::', this.productList)
  },
  mounted() {
    this.$emit('product', this.selectProduct)
  },
  methods: {
    navToStartPlan() {
      this.$router.push('/startplan')
    },
    selectProduct(Product) {
      this.selectedProduct = []
      this.selectedProduct.push(Product)
      this.selected = true
      this.$store.commit('setProduct', Product)
    },
    addToCart(product) {
      this.$store.commit('setCart', product)
      this.$router.push('/ShoppingCart')
    },
  },
}
</script>
<style scoped>
/* Product Slider */
.corp-exp.products {
  margin-top: 10px;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
}
.corp-exp.products > div {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.corp-exp.products > h3 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.corp-exp.products > h3 > span.action {
  color: #4c83b3;
  cursor: pointer;
}
.custom-pro-slide {
  text-align: center;
  background-color: #fff;
  width: 172px;
  border-radius: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
  margin: 5px;
}
.custom-pro-slide > .slide-header {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #7165e3;
  margin: 0 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.custom-pro-slide > .slide-header > img {
  height: 70px;
  width: 75px;
}
.custom-pro-slide .slide-content {
  padding: 0px 5px;
  min-height: 80px;
}
.slide-product-availability {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  padding-bottom: 0;
  position: absolute;
  top: 150px;
}
.slide-product-availability .mode {
  display: flex;
  font-size: 12px;
  line-height: 16px;
  color: #898a8d;
}
.slide-product-availability .mode img {
  margin-right: 5px;
  height: 12px;
  width: 12px;
  top: 2px;
  position: relative;
}
.custom-pro-slide .slide-content .product-name {
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  color: #000000;
}
.custom-pro-slide .slide-content .product-discount {
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #898a8d;
}
/* Product Slider */
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
