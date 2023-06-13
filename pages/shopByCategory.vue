<template lang="pug">
div.ps-3.shop-container
    div.flex-0 
      PageHeader.font-bold(:title="selectedCategoryAndProducts?.category?.category_name")
      div.main-container
        div.px-4
          input(type='text' id="search-product" placeholder="Search" @input="navToSearch")  
        div.container.corp-exp.products.p-2
          div.latest-claim(v-if="selectedCategoryAndProducts?.products?.length")
                div.slide.custom-pro-slide(v-for="product in filteredProductList" @click="addToCart({category: selectedCategoryAndProducts.category, product: product?.product})") 
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
          div.no-results-found(v-if="!filteredProductList?.length")     
            span No Results found for the search query    
</template>

<script>
export default {
  name: 'ShopByCategory',
  layout: 'session',
  data() {
    return {
      baseUrl: 'https://myfinfi-uat-uploads.s3.ap-south-1.amazonaws.com',
      selectedCategoryAndProducts: this.$store.getters.getSelectedCategory,
      filteredProductList: [],
    }
  },
  mounted() {
    this.filteredProductList = this.selectedCategoryAndProducts?.products
  },
  methods: {
    navToSearch(e) {
      const keyword = e?.target?.value?.toLowerCase()
      if (keyword) {
        console.log(
          ' this.selectedCategoryAndProducts',
          this.selectedCategoryAndProducts
        )
        this.filteredProductList =
          this.selectedCategoryAndProducts?.products.filter((OBJ) => {
            const productName = OBJ.product?.product_name?.toLowerCase()
            if (productName.includes(keyword)) {
              return OBJ
            }
            return false
          })
      } else {
        this.filteredProductList = this.selectedCategoryAndProducts?.products
      }
      // this.$router.push('/search')
    },
    addToCart(product) {
      this.$store.commit('setCart', product)
      this.$router.push('/ShoppingCart')
    },
  },
}
</script>
<style scoped>
.main-container {
  background: #f5f5f5;
  min-height: 100vh;
}

/* search component */
#search-product {
  margin-top: 10px;
  height: 48px;
  width: 100%;
  font-size: 18px;
  padding: 10px;
  background: #ffffff;
  border: 1px solid #e6e8e6;
  border-radius: 12px;
}
/* search component */

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

.corp-exp.products > div.no-results-found {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
/* Product Slider */

.ps-2 {
  width: 33.3%;
  text-align: center;
  margin-top: 2rem;
  border-bottom: 1px solid #d8d8d8;
  color: #d8d8d8;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
.ps-3 {
  min-height: 100vh;
}
</style>
