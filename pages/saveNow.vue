<template lang="pug">
  div.ps-3
    div.flex-0 
      PageHeader.font-bold(:title="'Buy Now'")
      input(type='text' id="search-product" placeholder="Search" @focus="navToSearch")  
    div.flex.flex-row.justify-between
      span.ps-2(v-for="name in items" :key="items.id"
       @click="selectedItem(name.name)"
       :class="[itemSelected==name.name ? 'bg-blue-600' : 'bg-white']")
        button {{name.name}}    
    div(v-if="itemSelected=='Explore'")
      CategoriesList.px-5(:categories="categories" v-on:select-category="selectedCategory")
      ProductList(:productList="productList" :selectedCategory="category" v-if='Boolean(category)')
      div.flex.ps-4.items-center.justify-center(v-if="!productList.length && categories.length && !category ") Please Select Category to View Products.  
    div(v-if="itemSelected=='Active plan'")
      ActivePlans
    div(v-if="itemSelected=='Past plan'")
      PastPlans
</template>

<script>
export default {
  name: 'SaveNow',
  layout: 'session',
  data() {
    return {
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
    navToSearch() {
      this.$router.push('/search')
    },
    navToDashboard() {
      this.$router.push('/dashboard')
    },
    navToActivePlans() {
      this.$router.push('/ActivePlans')
    },
    navToPastPlans() {
      this.$router.push('/PastPlans')
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
