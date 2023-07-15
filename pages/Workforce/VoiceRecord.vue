<template>
  <div>
    <div class="bg-blue-500 h-6"></div>
    <div class="bg-gray-100 relative">
      <div class="flex p-3">
        <button class="ml-5" @click="navToDashboard">
          <FaIcon class="mx-auto" icon="arrow-left" />
        </button>

        <p class="ml-4 pt-1">R & R Industries</p>

        <img
          class="rounded-full h-8 w-8 ml-auto mr-4"
          src="../../assets/Workforce/headerImage.png"
          alt=""
        />
      </div>
      <div>
        <!-- company data came here -->
        
      </div>

      <div>
          <!-- mapping all the audio -->

      </div>
      <div class="mt-96">
        <audio
          ref="audio"
          controls
          :src="audioLink"
          class="border border-black rounded-3xl mx-auto"
        ></audio>
        <br /><br />
        <div class="flex justify-around">
          <button
            :disabled="isRecording"
            @click="startRecording"
            class="block mb-4 px-4 py-2 text-white bg-blue-400 rounded-lg hover:bg-blue-600"
          >
            <FaIcon class="mx-auto" icon="circle-play" />
          </button>
          <button
            :disabled="!isRecording"
            @click="stopRecording"
            class="block mb-4 px-4 py-2 text-white bg-red-400 rounded-lg hover:bg-red-600"
          >
            <FaIcon class="mx-auto" icon="circle-stop" />
          </button>
        </div>
        <br />
        <button
          :disabled="!audioLink"
          class="block mt-4 mb-10 w-11/12 h-12 text-center mx-auto text-blue-400 bg-white border border-black rounded-3xl hover:bg-blue-600 hover:text-white"
          @click="submitAudio"
        >
          END JOB
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      audioChunks: [],
      audioLink: null,
    }
  },
  methods: {
    navToDashboard() {
      this.$router.push('/dashboard')
    },
    startRecording() {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.isRecording = true
          this.audioChunks = []
          this.mediaRecorder = new MediaRecorder(stream)

          this.mediaRecorder.addEventListener('dataavailable', (event) => {
            this.audioChunks.push(event.data)
          })

          this.mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
            this.audioLink = URL.createObjectURL(audioBlob)
            this.isRecording = false
            this.mediaRecorder = null
          })

          this.mediaRecorder.start()
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error)
        })
    },
    stopRecording() {
      if (this.isRecording) {
        this.mediaRecorder.stop()
        this.isRecording = false
      }
    },
    submitAudio() {
      if (this.audioLink) {
        console.log('Audio Link:', this.audioLink)
        // Call your submit function or API request here

        axios
          .post('http://localhost:8003/audio', {
            audioLink: this.audioLink
          })
          .then(response => {
            console.log('Audio submitted successfully');
          })
          .catch(error => {
            console.error('Error submitting audio:', error);
          });
      }
    },
  },
}
</script>

<style>
button {
  margin: 10px;
}
</style>
