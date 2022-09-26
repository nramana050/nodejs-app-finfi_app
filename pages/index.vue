<template lang="pug">  
div
  div(v-if="isLoading")
    SplashScreen.ps-6(v-on:splash="fromSplashScreen")
  div(v-if="!isLoading")
    div.ps-7
      div.ps-1
        LeadHeader.font-bold.text-3xl(:title="`Let\'s get started!`" )
      div.ps-2
        LeadHeader(:lead="'Please enter your organization'")
      div.ps-3
        LeadHeader(:lead="'code sent to your registered email'")
      div
        input.ps-4(class="focus:outline-none focus:shadow-outline" placeholder="Organization code" v-model="organizationCode")
      div.ps-5
        button.font-bold.text-white(@click="validate")
          span {{ $t('proceed') }}
    div.ps-8
      div.ps-9
        FooterLogo
      
</template>

<script>
import SplashScreen from '~/components/SplashScreen.vue';
import FooterLogo from '~/components/FooterLogo.vue';
export default {
    name: "IndexPage",
    components: { SplashScreen, FooterLogo },
    layout:'session',
    auth: false,
    data() {
        return {
            organizationCode: null,
            isLoading       : true
        };
    },
    watch: {
        organizationCode(newValue) {
            this.organizationCode = newValue.toUpperCase();
        }
    },
    beforeMount() {
        if (this.$auth.loggedIn && this.$auth.strategy.token.status().valid()) {
            this.$router.push("/dashboard");
        }
        this.$store.commit("clear", "organization");
    },
    methods: {
        async validate() {
            if (!this.organizationCode) {
                this.$toast.error("Provide organization code");
                return;
            }
            if (this.organizationCode)
                this.organizationCode = this.organizationCode.trim();
            if (this.organizationCode.length !== 6) {
                this.$toast.error("Organization code must be of 6 characters");
                return;
            }
            const organization = await this.$axios.$post(`/ext/organization`, { code: this.organizationCode });
            const { status, code, name } = organization;
            if (!status) {
                this.$toast.error("Organization not registered");
                return;
            }
            this.$store.commit("set", { param: "organization", value: { code, name } });
            this.$router.push("/login");
        },
        fromSplashScreen(){
          this.isLoading = false;
        }
    },
    
}
</script>
<style scoped>
  .ps-1{
    color: #37202B;
    margin-top: 3rem;
    margin-left:5.5rem;
    line-height: 52px;
    letter-spacing: -2px;
  }
  .ps-2{
   color: #1C1939CC;
   margin-top: 2.5rem;
   font-weight: 400;
   margin-left:3rem;
   margin-right:3rem;
  }
  .ps-3{
    color: #1C1939CC;
    font-weight: 400;
    margin-left:3rem;
    margin-right:3rem;
  }
  .ps-4{
    margin-left: 3rem;
    margin-top: 1rem;
    padding-left: 10px;
    padding-right: 4.75rem;
    padding-top: 10px;
    padding-bottom:10px;
  }
  .ps-5{
    background-color: #7165E3;
    width: 130px;
    height: 35px;
    font-weight: 500;
    margin-top: 3rem;
    margin-left:7.75rem;
    text-align: center;
    border-radius: 8px;
    padding-top: 5px;
  }
  .ps-6{
    height: 100vh;
    background-color: #7165E3;
    color: white;
    text-align: center;
    margin-left: 0;
    margin-top: 0;
}
.ps-7{
    height: 75vh;
}
.ps-8{
  height: 35vh;
  background-color: #7165E3;
  margin-top: -12vh;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.ps-9{
    width: 9rem;
    height: 9rem;
    margin-left: 32%;
    padding-top: 1rem ;
  }
</style>