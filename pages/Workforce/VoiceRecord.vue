<template>
  <div>
    <div class="bg-blue-500 h-6"></div>
    <div class="bg-gray-100 relative">
      <div class="flex p-3">
        <button class="ml-5" @click="navToDashboard">
          <FaIcon class="mx-auto" icon="arrow-left" />
        </button>

        <p class="ml-4 pt-1">R & R Industries</p>

        <!-- <button
          class="ml-auto mr-5 text-blue-400 hover:text-blue-600"
          @click="phone"
        >
          PhoneOtp
        </button> -->

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
      <!-- <button
        class="block mt-4 mb-10 w-11/12 h-12 text-center mx-auto text-blue-400 bg-white border border-black rounded-3xl hover:bg-blue-600 hover:text-white"
        @click="phone"
      >
        PhoneOtp
      </button> -->
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
        <div
          class="bg-white absolute inset-x-0 bottom-0 rounded-t-3xl"
          :class="{ hidden: !showPhoneNumberForm }"
        >
          <div class="text-center mt-10">
            <h3>Add phone number</h3>
            <p>We will send a verification code to this number</p>
            <input
              class="mt-4 w-7/8 h-12 focus border border-slate-300 rounded-md"
              type="text"
              v-model="phoneNumber"
            />
          </div>
          <button
            class="block relative mt-7 w-11/12 h-12 text-center mx-auto text-blue-400 bg-white border border-black rounded-3xl hover:bg-blue-600 hover:text-white"
            @click="otp"
          >
            SEND OTP
          </button>
        </div>
        <div
          class="bg-white absolute inset-x-0 bottom-0 rounded-t-3xl"
          :class="{ hidden: !showOtpForm }"
        >
          <div class="text-center mt-4">
            <h3>Enter the 6 digit code</h3>
            <p>
              Please confirm your account for entering the <br />
              authorization code sent to ****_****-5000
            </p>
            <input
              class="mt-6 mb-4 w-7/8 h-12 focus border border-slate-300 rounded-md"
              type="text"
              v-model="enteredOtp"
            />
          </div>
          <div class="flex">
            <button
              class="block mt-4 px-4 py-2 text-center mx-auto text-blue-400 bg-white border border-black rounded-3xl hover:bg-blue-600 hover:text-white"
              @click="resendOtp"
            >
              RESEND
            </button>
            <button
              class="block mt-4 px-4 py-2 text-center mx-auto text-blue-400 bg-white border border-black rounded-3xl hover:bg-blue-600 hover:text-white"
              @click="confirmOtp"
            >
              CONFIRM
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      audioChunks: [],
      audioLink: null,
      showPhoneNumberForm: false,
      showOtpForm: false,
      phoneNumber: '',
      otpNumber: '',
      enteredOtp: '',
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

        // Create a FormData object
        const formData = new FormData();
        formData.append('audio', this.audioLink);

        // Call your submit function or API request here using FormData
        axios
          .post(this.$getWFMUrlBase() + '/audio', formData, {
            headers: {
              'Content-Type': 'multipart/form-data' // Set the Content-Type header to 'multipart/form-data'
            }
          })
          .then((response) => {
            console.log('Audio submitted successfully')
            console.log(response)
            this.phone()
          })
          .catch((error) => {
            console.error('Error submitting audio:', error)
          })
      }
    },

    validatePhoneNumber() {
      return /^\d{10}$/.test(this.phoneNumber)
    },

    phone() {
      this.showPhoneNumberForm = !this.showPhoneNumberForm
      console.log(this.showPhoneNumberForm)
      this.showOtpForm = false

      //   const randomOtp = Math.floor(100000 + Math.random() * 900000);
      //   this.otpNumber = String(randomOtp);
      //   console.log(this.otpNumber)
    },

    otp() {
      if (this.phoneNumber.length === 10) {
        this.generateAndSendOtp()
        this.showPhoneNumberForm = false
        console.log(this.showPhoneNumberForm)
        this.showOtpForm = true
        this.enteredOtp = ''
      } else if (this.phoneNumber.length === 0) {
        alert('Please enter a 10-digit phone number.')
      } else {
        alert('Please enter a valid 10-digit phone number.')
      }
    },

    generateAndSendOtp() {
      const randomOtp = Math.floor(100000 + Math.random() * 900000)
      this.otpNumber = String(randomOtp)
      console.log(this.otpNumber)
    },

    confirmOtp() {
      if (this.enteredOtp.toString() === this.otpNumber) {
        this.$router.push('/Workforce/MeetPage')
      } else {
        alert('Incorrect OTP. Please try again.')
        this.enteredOtp = ''
      }
    },
    resendOtp() {
      this.enteredOtp = ''
      this.generateAndSendOtp()
    },
  },
}
</script>

<style>
button {
  margin: 10px;
}
</style>
