<template lang="pug">
  div.ps-3
    div.flex-0 
      PageHeader.font-bold(:title="'Search Product'")
      input(type='text' id="search-product" placeholder="Search" v-model="searchKeyword" @input="debounceSearch($event.target.value,$event)")  
    div
      ProductList(:productList="productList") 
</template>

<script>
export default {
  name: 'SearchPage',
  layout: 'session',
  data() {
    return {
      productList: [],
      searchKeyword: '',
    }
  },
  mounted() {},
  methods: {
    debounceSearch(value) {
      const self = this
      this.searchKeyword = value
      if (value) {
        clearTimeout(this.debounce)
        this.debounce = setTimeout(() => {
          self.getProducts(value)
        }, 1000)
      } else {
        self.productList = []
      }
    },
    search(value) {
      this.searchKeyword = value
      this.getProducts(value)
    },
    getProducts(searchQuery) {
      const self = this
      const fetchProduct = () => {
        const payload = {
          search_in_product_name: searchQuery,
        }
        self.$axios.$post(`/snbl/products`, payload).then((result) => {
          self.productList = result?.data
        })
      }
      fetchProduct()
    },
  },
}
</script>
<style scoped>
#search-product {
  border-bottom: 1px solid #989595;
  height: 42px;
  width: 100%;
  font-size: 18px;
  padding: 10px;
}
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
