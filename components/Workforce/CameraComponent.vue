<template>
    <div>
      <video ref="video" class="w-full h-4/6" v-if="!capturedImage"></video>
      <img :src="capturedImage" alt="Captured" class="w-full h-auto" v-if="capturedImage">
      <div v-if="!stream && !capturedImage">
        <button class="bg-black hover:bg-gray-800 text-white font-bold py-10 mt-60 px-10 border-2 m-auto block border-gray-500 rounded-full" @click="startCamera">
          Start
        </button>
      </div>
      <div v-if="stream && !capturedImage">
        <button class="bg-gray-400 hover:bg-gray-800 m-auto  text-white py-10 px-10 mt-60 block font-bold border-2 border-black rounded-full" @click="captureImage">
         Click 
        </button>
      </div>
      <div v-if="capturedImage" class="flex justify-center">
        <!-- <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="retakeImage">
          Retake
        </button> -->
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold  py-2 mt-60 px-4 rounded" @click="sendImage">
          Send
        </button>
      </div>
      <canvas ref="canvas" style="display: none;"></canvas>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        stream: null,
        capturedImage: null,
      };
    },
    mounted() {
      this.video = this.$refs.video;
      this.canvas = this.$refs.canvas;
    },
    methods: {
      async startCamera() {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
          this.video.srcObject = this.stream;
          this.video.play();
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      },
      captureImage() {
        const video = this.video;
        const canvas = this.canvas;
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const capturedDataUrl = canvas.toDataURL('image/png');
        this.capturedImage = capturedDataUrl;
        this.stopCamera();
      },
      retakeImage() {
        this.capturedImage = null;
        this.startCamera();
        this.video.play();
      },
      sendImage() {
        // Implement logic to send the captured image
        console.log('Sending Image:', this.capturedImage);
        this.$router.push('/Workforce/VoiceRecord');
      },
      stopCamera() {
        if (this.stream) {
          const tracks = this.stream.getTracks();
          tracks.forEach((track) => track.stop());
          this.stream = null;
        }
      },
    },
    beforeUnmount() {
      this.stopCamera();
    },
  };
  </script>
  
  <style>
  /* Your component-specific styles */
  </style>
  