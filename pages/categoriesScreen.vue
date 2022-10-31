<template lang="pug">
  div 
    div.ps-1
      div.ps-3(@click="navToSaveNow")
        FaIcon.mx-auto.ps-m.ps-4(icon='angle-left')
      p.text-3xl.font-bold.ps-5 What are you <br> saving for ?
      div.ps-11
        button.ps-9.font-bold(v-for="category in categories" :key="category.id"   
        @click="selectCategory(category.id)" 
        :class="[selectedValue==category.id && selected ? 'bg-yellow-200': 'bg-primary']")
          span.ps-6 {{category.category_name}}   
    div.ps-2(v-if="selected")
      button.ps-10.font-bold.text-xl(@click="navToMerchant") Next 

</template>
<script>
export default {
  name: 'CategoriesScreen',
  layout: 'empty',
  props: [],
  data() {
    return {
      categories: [],
      selectedCategories: [],
      selected: false,
      user: this.$auth.user,
      selectedValue:null
    }
  },
  mounted() {
    this.getCategories()
    this.$emit('Categories', this.selectedCategories)
  },
  methods: {
    navToSaveNow() {
      this.$router.push('/saveNow')
    },
    navToMerchant() {
      this.$router.push('/MerchantScreen')
    },
    selectCategory(category) {
      this.selectedCategories = []
      this.selectedCategories.push(category)
      this.selected = true
      this.selectedValue=category
      this.$store.commit('setCategory', category)
    },

    async getCategories() {
      const categories = await this.$axios.$get(`/snbl/category`)
      this.categories = categories.data
      console.log('category',this.categories)
    },
  },
}
</script>
<style scoped>
.ps-1 {
  height: 70vh;
  background-color: #7165e3;
  color: white;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.ps-3 {
  margin-left: 1.5rem;
  padding-top: 1rem;
}

.ps-5 {
  text-align: center;
  margin: 2rem;
}

.ps-6 {
  color: #1c1939;
  padding-left: 10px;
  padding-right: 10px;
}

.ps-8 {
  padding: 10px;
}

.ps-9 {
  margin:1rem;
  border-radius: 8px;
  align-items: center;
  height: 2.5rem;
}
.ps-11{
 margin: 1rem;
}

.ps-10 {
  width: 80%;
  margin-left: 2.5rem;
  margin-right: 2.5rem;
  margin-right: 2rem;
  margin-top: 8rem;
  margin-bottom: 2rem;
  background-color: #7165e3;
  color: white;
  padding: 12px;
  border-radius: 10px;
}
</style>
