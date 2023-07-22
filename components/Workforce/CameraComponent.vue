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
import axios from "axios";
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
  const video = this.video;
  const canvas = this.canvas;
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const capturedDataUrl = canvas.toDataURL("image/png");

  // Check if capturedDataUrl is not null or empty before setting it
  if (capturedDataUrl) {
    this.capturedImage = capturedDataUrl;
    this.stopCamera();
  } else {
    console.error("Failed to capture the image.");
  }
},


    retakeImage() {
      this.capturedImage = null
      this.startCamera()
      this.video.play()
    },
    async sendImage() {
      this.$router.push("/Workforce/VoiceRecord");
      if (this.capturedImage) {
        
        try {
          // Prepare the image data for upload
        const imageData = this.capturedImage;

        // Convert the base64 data to a Blob (file-like object)
        const blobData = this.dataURLtoBlob(imageData);
        
        // Create a new File object from the Blob
        const file = new File([blobData], "image.png", { type: "image/png" });

        // Set the endpoint URL for the backend route
        const endpoint = this.$getWFMUrlBase()+"/api/upload-image"; // Assuming the frontend is hosted on the same domain as the backend

        // Create a FormData object and append the file to it
        const formData = new FormData();
        formData.append("imageFile", file);

        // Send the image data to the backend using the HTTP POST request
        const response = await axios.post(endpoint, formData);
        
        // The response from the backend should contain the image URL if the upload is successful
        const imageUrl = response.data.imageUrl;
        console.log("Image uploaded to S3:", imageUrl);
      } catch (error) {
        console.error("Error uploading image to the server:", error);
      }
      } else {
        console.error("No captured image to send.");
    }
    },
    dataURLtoBlob(dataURL) {
  if (!dataURL) {
    throw new Error("Invalid dataURL: Cannot convert null/empty dataURL to Blob.");
  }

  // Convert base64 to Blob
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
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
