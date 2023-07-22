<template lang="pug">
div.custom-carousel
  ssr-carousel( :slides-per-page="4" v-if="categories.length > 0" overflow-visible=true)
    div.slide(v-for="category in categories" :key="category.category.id" 
    @click="selectCategory(category.category)")
      div.ps-3(:class="[selectedValue==category.category.id && selected ? 'bg-yellow-200': 'bg-primary']")
        img(:src="baseUrl+category.category.category_image" crossorigin="anonymous")
      div.ps-4.text-sm {{category.category.category_name}}

</template>
<script>
export default {
  props: {
    categories: {
      type: [],
      required: true,
    },
  },

  data() {
    return {
      selectedCategories: [],
      selected: false,
      user: this.$auth.user,
      selectedValue: null,
      baseUrl: this.$axios.defaults.baseURL,
    }
  },
  mounted() {
    this.baseUrl = this.$axios.defaults.baseURL
    this.$emit('Categories', this.selectedCategories)
  },
  methods: {
    selectCategory(category) {
      this.selectedCategories = []
      this.selectedCategories.push(category.id)
      this.selected = true
      this.selectedValue = category.id
      this.$store.commit('setCategory', category.id)
      this.$emit('select-category', category)
    },
  },
}
</script>
<style scoped>
.custom-carousel {
  overflow-x: auto !important;
  overflow-y: hidden;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.ps-3 {
  height: 4rem;
  width: 4rem;
  border-radius: 50px;
  margin-top: 1.5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  text-align: center;
  padding: 7px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.ps-4 {
  height: 4rem;
  width: 5rem;
  text-align: center;
  padding: 10px;
  letter-spacing: -1px;
}
</style>
