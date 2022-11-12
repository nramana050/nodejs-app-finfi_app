<template lang="pug">
    div.flex.flex-col.ps1
      div.flex-0
        PageHeader(:title="'FAQs'")
      div.ps-2(v-for="question in questions" :key="question.question" @click="selectedQuestion(question.question)")
        div.ps-4.font-bold {{question.question}}
        //- span
        //-   FaIcon.mx-auto(icon='lock')(@click="lockOpen")
          
        div.ps-3(v-if="selectedValue==question.question && selected") {{question.answer}}
</template>
<script>
export default{
    name:'AskedQuestions',
    layout:'empty',

    data(){
      return{
        answer:false,
        selectedQuestions:[],
        selected:false,
        selectedValue:'',
        questions:[
          {
            question:'Who is Finfi and how does it work?',
            answer:'We are a technology platform that works with your employer to give you access to a portion of your earned salary before your payday. You can use the Finfi app to track your available salary & also transfer the accessible amount to your salary account or purchase goods & services directly through your Rupay card.',
            },
          {
            question:'What are the charges for availing this facility?',
            answer:'A nominal bank transaction fee is charged for transfers as per the slabs shared by us with your employer. There is a one time fee of Rs 354 inclusive of GST for the physical card. You can reach out to us on care@myfinfi.com if you have any further questions on the charges.'
            },
          {
            question:'How do I get started?',
            answer:'If your company partners with Finfi, you get an email from techinfra@myfinfi.com with a link of the app, organization code & the registered mobile number. Pin the Finfi app to the screen of your mobile and complete the sign-up process.'
          },
          {
            question:'Is Finfi safe to use?',
            answer:'Yes. We use bank-level encryption technology to make sure our user’s data is protected 24/7.'
          },
          {
            question:'How much money can I get, and how often can I use the Finfi app?',
            answer:'A portion of your earned salary gets accrued everyday. Your HR sets the start date & the end date for the period during which the earned salary is accrued and is available to you. HR also sets the date on which the available balance is reset to zero. This date is typically a couple of days before the monthly salary payout date. You can see your available balance, start date & the end date, reset date and used salary on the dashboard of the app. '
          },
          {
            question:'How can I access funds?',
            answer:'You can access funds in two ways: 1. Transfer to the salary bank account shared by you or your HR department, 2. Finfi Rupay card'
          },
          {
            question:'Where will the money be transferred to?',
            answer:'To the bank account shared by you or HR (Salary Account). Select the amount you want to withdraw and confirm. The funds are transferred to your account.'
          },
          {
            question:'Why did I get less money than I had requested?',
            answer:'We deduct the processing fee for the salary withdrawal amount and deposit the balance amount in your bank account. '
          },
          {
            question:'How does Finfi appear on my payslip?',
            answer:'Finfi will appear as “other deduction” or as decided by your HR.'
          },
          {
            question:'How do I pay back?',
            answer:'Your employer will process the repayment on your payday. The salary amount already used by you during the month is deducted from your month end salary and the balance is paid to you as per regular salary process. '
          },
          {
            question:'How long does it take for money to be credited in my account after a fund request?',
            answer:'Fund transfers should happen within 2 hours. However, your organization may have a process of HR or HOD approval in place. In such cases, transfers will happen within 2 hours of approval. '
          },
          {
            question:'What is the cut off time for requests for funds transfer?',
            answer:'The cut off time for request is 6 pm, post 6 pm the request will be approved by 10:00 am the following day.'
          },
          {
            question:'Can the repayment date be extended ?',
            answer:'No extensions are possible. The entire repayment will be deducted from your current month’s salary'
          },
          {
            question:'Can I change my number?',
            answer:'To change your mobile number please reach out to us on email care@myfinfi.com or whatsapp number 9326776802.'
          },
          {
            question:'Is Credit Score a factor in using Finfi?',
            answer:'No, as Finfi is not a lending service, there is no impact on/of your credit score.'
          },
          {
            question:'What is the Finfi card?',
            answer:'It is a prepaid card designed to help you manage your expenses by aligning the timing of your income & expenses. Make payments via multiple online and offline modes. Pay bills, shop and use for all daily payment needs.'
          },
          {
            question:'How long does it take to receive my card?',
            answer:'After you complete the signup process, you can activate your virtual card by following the steps in the app. You can start using it for online transactions immediately post activation. Physical card takes 2 weeks for doorstep delivery after the completion of the KYC process.'
          },
          {
            question:'How can I check my balance on the card?',
            answer:'You can check your card balance at any time in the Finfi app.'
          },
          {
            question:'Can I add a different account number on the Finfi app?',
            answer:'You should use the same account that you have provided to your employer for receiving your salary.'
          },
          {
            question:'For any queries or app related issues',
            answer:'Please reach out to us on email care@myfinfi.com or whatsapp number 9326776802. Kindly mention your organization name, employee name & employee id in the mail subject or whatsapp message.'
          }
        ]
      }
    },
    methods:{
      showAnswer(){
        if(this.answer===true){
          this.answer=false
        }
        else{
          this.answer=true
        }
      },
      selectedQuestion(question){
         this.selectedQuestions = []
         this.selectedQuestions.push(question)
         this.selected = true
         this.selectedValue=question
      }
    }
}
</script>
<style scoped>
.ps1{
  background-color: #F2F2F2;
}


.ps-2{
    height: auto;
    width:90%;
    background-color: #FFFFFF;
    border-radius: 10px;
    color: #1C1939;
    margin: 1rem;
    box-shadow: 0px 35px 65px rgba(0, 0, 0, 0.0790811);
}
.ps-3{
  color: #1C1939;
  background-color: #F5F5F5;
  padding: 15px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.ps-4{
  padding: 20px;
}
</style>