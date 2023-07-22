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
          <div class="mb-8">
            <label for="location">Approver</label>
            <br />
            <input
            v-model="approver"
              id="location"
              type="text"
              class="w-full h-10 px-3 py-2 m-auto border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Select one"
            />
          </div>
          <div class="mb-4 mt-4">
            <label for="selectOption">Leave Type</label>
            <select
              v-model="selectOption"
              id="selectOption"
              class="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-300"
            >
              <option value="leave">Leave Type</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Public and religious holidays">Public and religious holidays</option>
              <option value="Holiday Leave">Holiday Leave</option>
            </select>
          </div>

          <div></div>

          
        </form>
      </div>

      <div class="flex mx-8 my-10">
        <div>
        <label for="dateFrom">Date from</label>
          <input
          v-model="dateFrom"
          id="dateFrom"
          type="date"
          class="text-gray-400 font-urbanist text-base font-medium leading-normal"
          placeholder="Select date"
        />
        </div>
        <div class="ml-auto">
        <label for="dateto">Date to</label>
          <input
          v-model="dateTo"
          id="dateto"
          type="date"
          class="text-gray-400 font-urbanist text-base font-medium leading-normal"
          placeholder="Select date"
        />
        </div>
      </div>

      <div class="flex mx-8 ml-8 mr-12">
   

<label class="flex items-center">
  <input  v-model="firstHalf" type="checkbox" class="
    
    border border-gray-500 rounded-md
    w-4 h-4 checked:bg-gray-500 checked:border-transparent
">

  <span class="ml-2">First half</span>
</label>
<label class="flex items-center ml-auto">
 <input v-model="secondHalf" type="checkbox" class="
   
    border border-gray-500 rounded-md
    w-4 h-4 checked:bg-gray-500 checked:border-transparent
">

  <span class="ml-2">Second half</span>
</label>



      </div>


      <div class="mb-8 mx-9 mt-5">
            <br />
            <input
              v-model="reason"
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
        class="block mt-32 mb-10 w-11/12 h-12 text-center mx-auto text-white bg-blue-400 rounded-3xl hover:bg-blue-600"
        @click="requestLeave()"
      >
        Request For Leave
      </button>
    </div>
  </div>
</template>

<script>

// VikasRev:July22: where are we filling userId? I believe finfi_server
//   can derive it based on auth tokens. is that the approach?
import axios from 'axios';
export default {
      data() {
      return {
        approval: '',
        leaveType: '',
        leaveDateFrom: '',
        leaveDateTo: '',
        firstHalf: false,
        secondHalf: false,
        reason: '',
        // attachment: null,
        // <!-- v-model="attachment" -->
      };
    },
  methods: {
    requestLeave() {
      console.log("what this ")
        const data = {
          approval: this.approver,
          leaveType: this.selectOption,
          leaveDateFrom: this.dateFrom,
          leaveDateTo: this.dateTo,
          firstHalf: this.firstHalf,
          secondHalf: this.secondHalf,
          reason: this.reason,
          // attachment: this.attachment,
        };

        axios
          .post(this.$getWFMUrlBase() + '/leaves', data)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log('Error occurred:', error);
          });

          this.$router.push('/Workforce/DashboardScreen');
      },
    
    navToDashboard() {
      this.$router.push('/workforce/dashboardscreen')
    }


  },
}
</script>

<style></style>
