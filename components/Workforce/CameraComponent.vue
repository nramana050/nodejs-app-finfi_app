<template>
  <div
    :class="{
      'camera-wrapper': true,
      'black-background': startCamera,
      capturedImage,
    }"
  >
    <video
      ref="video"
      class="w-full h-full bg-black rounded-t-3xl"
      v-if="!capturedImage"
    ></video>

    <img
      :src="capturedImage"
      alt="Captured"
      class="w-full h-auto"
      v-if="capturedImage"
    />

    <div v-if="!stream && !capturedImage">
      <button
        class="text-black font-bold bg-white py-10 mb-5 px-10 border-2 m-auto block border-gray-500 rounded-full"
        @click="startCamera"
      >
        Start
      </button>
    </div>
    <div v-if="stream && !capturedImage" class="w-full bg-black rounded-b-3xl">
      <button
        class="bg-white m-auto text-black py-10 mb-5 px-10 block font-bold border-2 border-black rounded-full"
        @click="captureImage"
      >
        Click
      </button>
    </div>
    <div v-if="capturedImage" class="w-full bg-black rounded-b-3xl">
      <button
      class="bg-white m-auto text-black py-10 mb-5 px-10 block font-bold border-2 border-black rounded-full"
        @click="sendImage"
      >
        Send
      </button>
    </div>
    <canvas ref="canvas" style="display: none"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stream: null,
      capturedImage: null,
    }
  },
  mounted() {
    this.video = this.$refs.video
    this.canvas = this.$refs.canvas
  },
  methods: {
    async startCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true })
        this.video.srcObject = this.stream
        this.video.play()
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    },
    captureImage() {
      const video = this.video
      const canvas = this.canvas
      const context = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const capturedDataUrl = canvas.toDataURL('image/png')
      this.capturedImage = capturedDataUrl
      this.stopCamera()
    },
    retakeImage() {
      this.capturedImage = null
      this.startCamera()
      this.video.play()
    },
    sendImage() {
      // Implement logic to send the captured image
      console.log('Sending Image:', this.capturedImage)
      this.$router.push('/Workforce/VoiceRecord')
    },
    stopCamera() {
      if (this.stream) {
        const tracks = this.stream.getTracks()
        tracks.forEach((track) => track.stop())
        this.stream = null
      }
    },
  },
  beforeUnmount() {
    this.stopCamera()
  },
}
</script>

<style>
/* Your component-specific styles */

.camera-wrapper {
  height: 90vh; /* Set the height to 100% of the viewport height */
  display: flex;
  border-radius: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.black-background {
  background-color: black; /* Set the background color to black */
}
</style>
