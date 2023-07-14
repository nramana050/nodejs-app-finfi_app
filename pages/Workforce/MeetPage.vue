<template>
  <!-- This div for complete page  -->
  <div>
    <!-- Header Section  -->
    <div class="bg-blue-500 h-6"></div>

    <!-- This div for background color   -->
    <div style="background: #f5f5f5">
      <!-- Arrow section  -->

      <div class="flex p-3">
        <button @click="navToDashboard" class="ml-5">
          <FaIcon class="mx-auto" icon="arrow-left" />
        </button>

        <p class="ml-4 pt-1">Meeting Details</p>

        <img
          class="rounded-full h-8 w-8 ml-auto mr-4"
          src="../../assets/Workforce/headerImage.png"
          alt=""
        />
      </div>

      <div class="flex mx-12 mt-14">
        <div class="flex items-center">
          <img
            style="width: 18.601px; height: 20px; flex-shrink: 0"
            src="../../assets/Workforce/Company.png"
            alt="Image"
          />
        </div>

        <div class="flex items-center ml-5">
          <input
            class="text-gray-600 bg-gray-100 text-sm p-1 font-urbanist font-medium leading-normal tracking-wide"
            type="text"
            placeholder=" Company Name"
          />
        </div>
      </div>
      <hr class="mt-2 w-72 m-auto"/>
      
      <div class="flex mx-12 mt-4">
        <div class="flex items-center">
          <img
            style="width: 18.601px; height: 20px; flex-shrink: 0"
            src="../../assets/Workforce/Vector.svg"
            alt="Image"
          />
        </div>

        <div class="flex items-center ml-5">
          <input
            class="text-gray-600 bg-gray-100 text-sm p-1 font-urbanist font-medium leading-normal tracking-wide"
            type="text"
            placeholder="Contact Person"
          />
        </div>
      </div>
      <hr class="mt-2 w-72 m-auto"/>
      <div class="flex mx-12 mt-3">
        <div class="flex items-center">
          <img
            style="width: 18.601px; height: 20px; flex-shrink: 0"
            src="../../assets/Workforce/Group.svg"
            alt="Image"
          />
        </div>

        <div class="flex items-center ml-5">
          <input
            class="text-gray-600 bg-gray-100 text-sm p-1 font-urbanist font-medium leading-normal tracking-wide"
            type="number"
            placeholder="Contact Number"
          />
        </div>
      </div>
      <hr class="mt-2 w-72 m-auto"/>
      <div class="flex mx-12 mt-3">
        <div class="flex items-center">
          <img
            style="width: 18.601px; height: 20px; flex-shrink: 0"
            src="../../assets/Workforce/Notes.svg"
            alt="Image"
          />
        </div>

        <div class="flex items-center ml-5">
          <input
            class="text-gray-600 bg-gray-100 text-sm p-1 font-urbanist font-medium leading-normal tracking-wide"
            type="text"
            placeholder=" Task assigned"
          />
        </div>
      </div>
      <hr class="mt-2 w-72 m-auto"/>
      <div class="flex mx-12 mt-3">
        <div class="flex items-center">
          <img
            style="width: 18.601px; height: 20px; flex-shrink: 0"
            src="../../assets/Workforce/Notes.svg"
            alt="Image"
          />
        </div>

        <div class="flex items-center ml-5">
          <input
            class="text-gray-600 bg-gray-100 text-sm p-1 font-urbanist font-medium leading-normal tracking-wide"
            type="text"
            placeholder="Discussed in meeting"
          />
        </div>
      </div>
      <hr class="mt-2 w-72 m-auto"/>
      <div class="flex mx-12 mt-3">
        <div class="flex items-center">
          <img
            style="width: 18.601px; height: 20px; flex-shrink: 0"
            src="../../assets/Workforce/status.svg"
            alt="Image"
          />
        </div>

        <div class="flex items-center ml-5">
          <input
            class="text-gray-600 bg-gray-100 text-sm p-1 font-urbanist font-medium leading-normal tracking-wide"
            type="text"
            placeholder="Status"
          />
        </div>
      </div>
      <hr class="mt-2 w-72 m-auto"/>
      <div class="flex mx-12 mt-3">
        <div class="flex items-center">
          <img
            style="width: 18.601px; height: 20px; flex-shrink: 0"
            src="../../assets/Workforce/Group.svg"
            alt="Image"
          />
        </div>

        <div class="flex items-center ml-5">
          <input
            class="text-gray-600 bg-gray-100 text-sm p-1 font-urbanist font-medium leading-normal tracking-wide"
            type="text"
            placeholder="Notes"
          />
        </div>
      </div>
      <hr class="mt-2 w-72 m-auto"/>

      <button
        class="block mt-64 mb-10 w-11/12 h-12 text-center mx-auto text-white bg-blue-400 rounded-3xl hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navToDashboard() {
      this.$router.push('/dashboard')
    },
  },
}
</script>

<style></style>
