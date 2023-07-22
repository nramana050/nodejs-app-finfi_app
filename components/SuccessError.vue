<template lang="pug">
div.success-error-screen(v-if="isSuccess || isError")
    div.img-container
      img(src='~/assets/myfinfi-icons/success.png' v-if="isSuccess") 
      img(src='~/assets/myfinfi-icons/error.png' v-if="isError")
    div.successfull(v-if="isSuccess")  
      div.header  
        h4 Congratulations!
      div.success-body  
        p {{successMessage1}}
        p {{successMessage2}}
      div.header(v-if="isCardOrder")  
        h4 Want more!  
      div.success-body(v-if="isCardOrder")    
        p Order a physical card and earn up to 10% on your in-store transactions also 
          span(@click="requestPhysicalCard") Order Now  
    div.successfull(v-if="isError")
      div.header  
          h4 Failed  
      div.success-body  
          p {{ errorMessage }}
    div.actions
      button.goto-home(@click="goToHome") Home 
      //- button.unlock(v-if="isSuccess && isCardOrder") Unlock your Card
      button.retry(v-if="isError && buttonText" @click="callBack") {{buttonText}}
 
</template>

<script>
export default {
  name: 'SuccessError',
  props: {
    isSuccess: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: Boolean,
      default: false,
    },
    isCardOrder: {
      type: Boolean,
      default: false,
    },
    successMessage1: {
      type: String,
    },
    successMessage2: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    buttonText: {
      type: String,
    },
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {
    callBack(e) {
      e.preventDefault()
      this.$emit('callBack')
    },
    goToHome(e) {
      this.$router.push('/workforce/dashboardscreen')
    },
    requestPhysicalCard(e) {
      this.$router.push('/RequestPhysical')
      e.preventDefault()
    },
  },
}
</script>
<style scoped>
.success-error-screen {
  height: 100vh;
  padding-top: 30px;
}
.success-error-screen > .img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.success-error-screen > .img-container > img {
  width: 171px;
  height: 171px;
}
.success-error-screen > .successfull > .header {
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  text-align: center;
  color: #979797;
  margin-top: 30px;
  margin-bottom: 10px;
}
.success-error-screen > .successfull > .success-body {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #979797;
}
.success-error-screen > .successfull > .success-body p > span {
  letter-spacing: 0.01em;
  color: #7165e3;
}
.success-error-screen > .actions {
  margin-top: 30px;
}
.success-error-screen > .actions > button {
  width: 350px;
  height: 44px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
}
.success-error-screen > .actions > button.goto-home {
  background: #ffffff;
  border: 1px solid #979797;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-align: center;
  color: #7165e3;
}
.success-error-screen > .actions > button.retry,
.success-error-screen > .actions > button.unlock {
  background: #7165e3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-align: center;
  color: #ffffff;
}
</style>
