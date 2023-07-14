<template>
  <div>
    <!-- first Header Section -->
    <div class="bg-blue-500 h-6"></div>

    <!-- This div for background color -->
    <div class="bg-gray-100">
      <!-- Arrow section -->
      <div class="flex p-3">
        <button class="ml-5" @click="navToDashboard">
          <FaIcon class="mx-auto" icon="arrow-left" />
        </button>

        <p class="ml-4 pt-1">Apply For Leave</p>

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
          <label for="myself">For me</label>
        </div>
        <div>
          <input
            id="someone-else"
            type="radio"
            name="person"
            class="ml-6 mr-2"
          />
          <label for="someone-else">For others</label>
        </div>
      </div>

      <!-- Form Input -->
      <div class="mt-6">
        <form class="w-5/6 m-auto font-medium">
          <div class="mb-4">
            <label for="location">Approver</label>
            <br />
            <input
              id="location"
              type="text"
              class="w-full h-10 px-3 py-2 m-auto border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Select one"
            />
          </div>
          <div class="mb-4">
            <label for="selectOption">Leave Type</label>
            <select
              id="selectOption"
              class="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-300"
            >
              <option value="leave">Leave Type</option>
              <option value="option1">Medical Leave</option>
              <option value="option2">Personal Leave</option>
              <option value="option3">Public and religious holidays</option>
              <option value="option4">Holiday Leave</option>
            </select>
          </div>

          <div></div>

          
        </form>
      </div>

      <div class="flex mx-8 my-10">
        <div>
        <label for="dateFrom">Date from</label>
          <input
          id="dateFrom"
          type="date"
          class="text-gray-400 font-urbanist text-base font-medium leading-normal"
          placeholder="Select date"
        />
        </div>
        <div class="ml-auto">
        <label for="dateto">Date to</label>
          <input
          id="dateto"
          type="date"
          class="text-gray-400 font-urbanist text-base font-medium leading-normal"
          placeholder="Select date"
        />
        </div>
      </div>

      <div class="flex mx-8 ml-8 mr-12">
   

<label class="flex items-center">
  <input type="checkbox" class="
    
    border border-gray-500 rounded-md
    w-4 h-4 checked:bg-gray-500 checked:border-transparent
">

  <span class="ml-2">First half</span>
</label>
<label class="flex items-center ml-auto">
 <input type="checkbox" class="
   
    border border-gray-500 rounded-md
    w-4 h-4 checked:bg-gray-500 checked:border-transparent
">

  <span class="ml-2">Second half</span>
</label>



      </div>


      <div class="mb-6 mx-9 mt-5">
            <br />
            <input
              id="reason"
              type="text"
              class="w-full placeholder-relative-top-0 h-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Type your message"
            />
          </div>

    


        <div class="mb-4 mx-8">
            <label for="location">Add an attachment </label>
            <br />
            <input
              id="location"
              type="file"
              class="mt-3"
             
            />
          </div>



     
      <button
        class="block mt-64 mb-10 w-11/12 h-12 text-center mx-auto text-white bg-blue-400 rounded-3xl hover:bg-blue-600"
      >
        Request For Leave
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
