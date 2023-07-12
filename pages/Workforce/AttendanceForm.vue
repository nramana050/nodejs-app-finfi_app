<template>
  <div>
    <!-- Header Section -->
    <div class="bg-blue-500 h-6"></div>

    <!-- This div for background color -->
    <div class="bg-gray-100">
      <!-- Arrow section -->
      <div class="flex p-3">
        <button class="ml-5" @click="navToDashboard" >
          <FaIcon class="mx-auto" icon="arrow-left" />
        </button>

        <p class="ml-4 pt-1">Attendance Request</p>

        <img
          class="rounded-full h-8 w-8 ml-auto mr-4"
          src="../../assets/Workforce/headerImage.png"
          alt=""
        />
      </div>

      <!-- Radio Buttons -->
      <div class="flex justify-around items-center mt-5">
        <div>
          <input id="myself" type="radio" name="person" class="mr-2" />
          <label for="myself">Myself</label>
        </div>
        <div>
          <input
            id="someone-else"
            type="radio"
            name="person"
            class="ml-6 mr-2"
          />
          <label for="someone-else">Someone Else</label>
        </div>
      </div>

      <!-- Form Input -->
      <div class="mt-6">
        <form class="w-5/6 m-auto font-medium">
          <div class="mb-4">
            <label for="location">Location</label>
            <br />
            <input
              id="location"
              type="text"
              class="w-full h-10 px-3 py-2 m-auto border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div class="mb-4">
            <label for="dateFrom">Date from</label>
            <br />
            <input
              id="dateFrom"
              type="date"
              class="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-300"
            />
          </div>
          <div class="mb-4">
            <label for="dateTo">Date to</label>
            <br />
            <input
              id="dateTo"
              type="date"
              class="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-300"
            />
          </div>
          <div class="mb-6">
            <label for="reason">Reason</label>
            <br />
            <input
              id="reason"
              type="text"
              class="w-full placeholder-relative-top-0 h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
        </form>
      </div>

      <!-- Submit Button -->
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

<style>
input[type='date']::-webkit-inner-spin-button,
input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(70%);
}
</style>
