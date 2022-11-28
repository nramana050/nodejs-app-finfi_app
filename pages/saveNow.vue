<template lang="pug">
  div 
    div.flex-0 
      PageHeader.font-bold(:title="'Save Now Buy Later'")
    div.flex.flex-row.justify-between
      span.ps-2(v-for="name in items" :key="items.id"
       @click="selectedItem(name.name)"
       :class="[itemSelected==name.name ? 'bg-blue-600' : 'bg-white']")
        button {{name.name}}    
    div(v-if="itemSelected=='Explore'")
      CategoriesList.px-5(:categories="categories" v-on:select-category="selectedCategory")
      ProductList(:productList="productList")
    div(v-if="itemSelected=='Active plan'")
      ActivePlans
    div(v-if="itemSelected=='Past plan'")
      PastPlans

</template>
<script>
export default {
  name: 'SaveNow',
  layout: 'session',
  data(){
    return{
       items:[
            {
            id:'01',
            name:'Explore'
             },
            {
            id:'02',
            name:'Active plan'
            },
            {
            id:'03',
            name:'Past plan'
            },],
       itemSelected:'Explore',
       categories:[],
       productList:[],
       category:'',
      }
  },
  mounted() {
    this.getCategories()
    this.getProducts()
  },
  methods: {
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
    selectedItem(name){
      this.itemSelected=[]
      this.itemSelected.push(name)
    },
    async getCategories() {
      const categories = await this.$axios.$get(`/snbl/category`)
      this.categories = categories.data
    },
    selectedCategory(category){
      this.category=category
      console.log(category)
      this.getProducts()
    },
    async getProducts() {
      const payload = { category: [this.category] }
      await this.$axios.$post(`/snbl/products`, payload).then((result) => {
        this.productList = [];
        console.log(result.data)
        this.productList = result.data
      })
    },
    
  },
}
</script>
<style scoped>
  .ps-2{
    width: 33.3%;
  text-align: center;
  margin-top: 2rem;
  border-bottom: 1px solid #D8D8D8;
  color: #D8D8D8;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  }
 
</style>
