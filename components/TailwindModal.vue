<template lang="pug">
  vue-final-modal(
    v-slot="{ params, close }"
    v-bind="$attrs"
    classes="flex justify-center items-center"
    content-class="flex flex-col max-h-full w-full p-4 border dark:border-gray-800 rounded bg-white dark:bg-gray-900 fixed bottom-0"
    v-on="$listeners")
    span.text-2xl.font-bold
      slot(name="title")
    div.flex-grow.overflow-y-auto
      slot(:params="params")
    button.absolute.top-0.right-0.mt-2.mr-2(@click="close")
      outline-x-icon.w-8.h-8.mr-2
</template>