<template lang="pug">
div
    div.flex-0 
      PageHeader.font-bold(:title="'Search Product'")
      input(type='text' ref="search" id="search-product" placeholder="Search" v-model="searchKeyword" @input="search($event.target.value,$event)")  
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
  mounted() {
    this.$refs.search.focus()
  },
  methods: {
    search(value) {
      const _self = this
      this.searchKeyword = value
      clearTimeout(this.debounce)
      _self.debounce = setTimeout(() => {
        _self.getProducts()
      }, 1000)
    },
    getProducts() {
      if (this.searchKeyword) {
        const payload = {
          search_in_product_name: this.searchKeyword,
        }
        this.$axios.$post(`/snbl/products`, payload).then((result) => {
          this.productList = result?.data
        })
      } else {
        this.productList = []
      }
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
</style>
