<template lang="pug">
div
  CoolLightBox(:items="images" :index="index" @close="index=null" crossorigin="anonymous")
  div.images-wrapper
    img(:src="image.src" v-for="(image, imageIndex) in images" :key="imageIndex" @click="index = imageIndex" crossorigin="anonymous")
  </template>

<script>
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
export default {
  components: {
    CoolLightBox,
  },
  name: 'LightBox',
  props: {
    imagesData: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    if (this.imagesData) {
      console.log('IMAGES::', this.imagesData)
      this.images = [...this.images, ...this.imagesData]
    }
  },
  updated() {
    // Custom Js to laod the image
    const imageContainer = document.querySelectorAll(
      '.cool-lightbox__slide__img'
    )
    const imageBtns = document.querySelectorAll(
      '.cool-lightbox-thumbs__list>button'
    )
    if (imageContainer) {
      imageContainer.forEach((el) => {
        el.children[0].setAttribute('crossorigin', 'anonymous')
      })
    }
    if (imageBtns) {
      imageBtns.forEach((el) => {
        el.children[0].setAttribute('crossorigin', 'anonymous')
      })
    }
  },
  data() {
    return {
      images: [],
      index: null,
    }
  },
}
</script>

<style>
.supportive-docs .images-wrapper {
  display: flex;
  overflow-x: scroll;
}
.supportive-docs img {
  height: 100px;
  width: 100px;
  margin: 10px;
  border: 1px solid #000;
}
.cool-lightbox .cool-lightbox__slide img {
  height: initial;
  width: initial;
}
.cool-lightbox
  .cool-lightbox-thumbs
  .cool-lightbox-thumbs__list
  .cool-lightbox__thumb {
  background-color: transparent !important;
}
</style>
