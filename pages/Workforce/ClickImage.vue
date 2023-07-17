<template>
    <div>
      <!-- Header Section -->
      <div class="bg-blue-500 h-6"></div>
  
      <!-- This div for background color -->
      <div class="bg-gray-100">
        <!-- Arrow section -->
        <div class="flex p-3">
          <button class="ml-5" @click="navToDashboard">
            <FaIcon class="mx-auto" icon="arrow-left" />
          </button>
  
          <p class="ml-4 pt-1">Click Picture</p>
  
          <img class="rounded-full h-8 w-8 ml-auto mr-4" src="../../assets/Workforce/headerImage.png" alt="" />
        </div>
  
        <!-- Camera Component -->
        <CameraComponent v-if="!capturedImage" @imageCaptured="onImageCaptured" />
  
        <!-- Captured Image -->
        <div v-if="capturedImage">
          <img :src="capturedImage" alt="Captured" class="w-full h-auto" />
          <div class="flex justify-center mt-4">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="retakeImage">
              Retake
            </button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" @click="sendImage">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
//   import { FaIcon } from '@fortawesome/vue-fontawesome';
  import CameraComponent from '../../components/Workforce/CameraComponent.vue';
  
  export default {
    components: {
    //   FaIcon,
      CameraComponent,
    },
    data() {
      return {
        capturedImage: null,
      };
    },
    methods: {
      onImageCaptured(imageData) {
        this.capturedImage = imageData;
      },
      retakeImage() {
        this.capturedImage = null;
      },
      sendImage() {
        // Placeholder logic to send the captured image
        console.log('Sending Image:', this.capturedImage);
        this.capturedImage = null;
      },
      navToDashboard() {
        // Implement navigation logic to go back to the dashboard
      },
    },
  };
  </script>
  
  <style>
  /* Your component-specific styles */
  </style>
  