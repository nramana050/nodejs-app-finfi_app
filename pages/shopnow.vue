<template lang="pug">
  div.ps-3.shop-container
    div.flex-0 
      PageHeader.font-bold(:title="'Shop'")
      div.main-container
        div.px-5
          div.how_it_works.container
              div.header
                span.info {{isHowItWorks ? "How to use voucher" : "Buy Voucher"}} 
                span.takeaction(@click="toggleHowItWorks") {{isHowItWorks ? "Back" : "How it works?"}}
              div.body(v-if='!isHowItWorks')
                span aws image
              div.action(v-if='!isHowItWorks')
                button Pick a Brand
              div.content.steps(v-if='isHowItWorks')
                div.step1
                  h3.step1-color  Step 1
                  p Buy the voucher and get cashback on your bank account
                div.step2
                  h3.step2-color  Step 2
                  p You will get a voucher from FINFI on eMail & SMS
                div.step3
                  h3.step3-color  Step 3
                  p Use the voucher in th brand store or website/app as per their policy
                  p 
                    span in 
                    span on
          input(type='text' id="search-product" placeholder="Search" @focus="navToSearch")  
        
        div.container.corp-exp.products.p-5(v-for='categoryWiseProduct in categoryWiseProductListing')
          h3.font-bold
            span {{categoryWiseProduct?.category.category_name}}   
            span.action(@click="()=> navToCategory(categoryWiseProduct)") See All
          div.latest-claim(v-if="categoryWiseProduct?.products?.length")
              ssr-carousel(:slides-per-page=2 :loop='true' :show-arrows='false' :feather='false' :gutter='10')
                div.slide.custom-pro-slide(v-for="product in categoryWiseProduct?.products" @click="selectProduct(product)") 
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
        //- div.flex.flex-row.justify-between
        //-   span.ps-2(v-for="name in items" :key="items.id"
        //-   @click="selectedItem(name.name)"
        //-   :class="[itemSelected==name.name ? 'bg-blue-600' : 'bg-white']")
        //-     button {{name.name}}    
        //- div(v-if="itemSelected=='Explore'")
        //-   CategoriesList.px-5(:categories="categories" v-on:select-category="selectedCategory")
        //-   ProductList(:productList="productList" :selectedCategory="category" v-if='Boolean(category)')
        //-   div.flex.ps-4.items-center.justify-center(v-if="!productList.length && categories.length && !category ") Please Select Category to View Products.  
        //- div(v-if="itemSelected=='Active plan'")
        //-   ActivePlans
        //- div(v-if="itemSelected=='Past plan'")
        //-   PastPlans
</template>

<script>
export default {
  name: 'SaveNow',
  layout: 'session',
  data() {
    return {
      isHowItWorks: false,
      categoryWiseProductListing: [],
      baseUrl: this.$axios.defaults.baseURL,
      items: [
        {
          id: '01',
          name: 'Explore',
        },
        // {
        //   id: '02',
        //   name: 'Active plan',
        // },
        // {
        //   id: '03',
        //   name: 'Past plan',
        // },
      ],
      itemSelected: 'Explore',
      categories: [],
      productList: [],
      category: '',
    }
  },
  mounted() {
    if (this.$auth.strategy.token.status().valid()) {
      this.getCategories()
    }
  },
  methods: {
    toggleHowItWorks() {
      this.isHowItWorks = !this.isHowItWorks
    },
    navToCategory(data) {
      this.$store.commit('setSelectedCategory', data)
      this.$router.push('/shopByCategory')
    },
    navToSearch() {
      this.$router.push('/search')
    },
    navToDashboard() {
      this.$router.push('/dashboard')
    },
    navToActivePlans() {
      this.$router.push('/activeplans')
    },
    navToPastPlans() {
      this.$router.push('/pastplans')
    },
    navToCategories() {
      this.$router.push('/categoriesList')
    },
    selectedItem(name) {
      this.itemSelected = []
      this.itemSelected.push(name)
    },

    async getCategories() {
      const categories = await this.$axios.$get(`/snbl/category`)
      this.categories = categories.data
      // get all categories product and set shop
      const promiseArray = []
      categories.data.forEach(({ category }) => {
        promiseArray.push(this.getCategoryProducts(category.id))
      })
      const products = await Promise.all(promiseArray)
      const catProducts = categories.data.map((category, idx) => ({
        category: { ...category.category },
        products: products[idx],
      }))
      console.log('CAT PRODs:', catProducts)
      this.categoryWiseProductListing = catProducts
      this.$store.commit('setShop', catProducts)
    },
    async getCategoryProducts(id) {
      const payload = { category: [id] }
      return await this.$axios
        .$post(`/snbl/products`, payload)
        .then((result) => result?.data)
    },
    selectedCategory(category) {
      this.category = category
      this.getProducts()
    },

    async getProducts() {
      const payload = !this.category
        ? { category: [] }
        : { category: [this.category.id] }
      await this.$axios.$post(`/snbl/products`, payload).then((result) => {
        this.productList = result?.data
      })
    },
  },
}
</script>
<style scoped>
.shop-container > div > div:nth-child(1) {
  height: 100px;
  padding-top: 0;
}
.main-container {
  background: #f5f5f5;
  min-height: 100vh;
}
/* component h-i-w */
.how_it_works.container {
  background: #ffffff;
  box-shadow: 0px 30px 60px rgba(0, 0, 0, 0.0790811);
  border-radius: 10px;
  min-height: 190px;
  position: relative;
  top: -40px;
  padding: 10px 20px;
}
.how_it_works.container > .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.how_it_works.container > .header > .info {
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  color: #1c1939;
}
.how_it_works.container > .header > .takeaction {
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  color: #7165e3;
  cursor: pointer;
}
.how_it_works.container > .body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}
.how_it_works.container > .action {
  display: flex;
  justify-content: center;
  align-items: center;
}
.how_it_works.container > .action > button {
  width: 130px;
  height: 28px;
  background: #7165e3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  color: #fff;
}

.how_it_works.container > .content.steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.step1-color {
  color: #7165e3;
}
.step2-color {
  color: #bc9f27;
}
.step3-color {
  color: #4bb0a4;
}
.how_it_works.container > .content.steps p {
  font-weight: 400;
  font-size: 11px;
  line-height: 14px;
  color: #898a8d;
}
.how_it_works.container > .content.steps > div > h3 {
  margin-bottom: 10px;
}
.how_it_works.container > .content.steps > div > p:nth-child(2) {
  border-right: 1px solid #e9e9fc;
  padding-right: 5px;
}
.how_it_works.container > .content.steps > div:nth-child(3) > p:nth-child(2) {
  border-right: 0px;
}
.how_it_works.container > .content.steps > div {
  margin-right: 5px;
  max-width: 87px;
}
/* component h-i-w */

/* search component */
#search-product {
  height: 42px;
  width: 100%;
  font-size: 18px;
  padding: 10px;
  background: #ffffff;
  border: 1px solid #e6e8e6;
  border-radius: 12px;
  position: relative;
  top: -30px;
}

/* search component */

/* Product Slider */
.corp-exp.products {
  background: rgba(229, 226, 255, 0.4);
  margin-top: 10px;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
  padding-bottom: 1.25rem;
  position: relative;
  top: -30px;
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
  min-width: 180px;
  border-radius: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
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
