<template lang="html">
    <div class="container flex justify-center items-center">
        <div class="w-full px-5 py-6 bg-gradient-to-r from-primary to-black shadow-xl rounded-xl">
            <p class="text-xs text-gray-200 shadow-2xl uppercase">Cardholder Name</p>
            <p class="text-ms text-white shadow-2xl tracking-wider uppercase pt-1 font-bold">Arunraj Selvam</p>
            <p class="text-xl text-white font-bold tracking-widest py-5">1234 4567 8901 2345</p>
            <div class="flex flex-row justify-between items-center">
                <div>
                    <p class="text-xs text-gray-200 font-bold uppercase">Valid From</p>
                    <p class="text-xs text-white font-bold tracking-wider">10/22</p>
                </div>
                <div>
                    <p class="text-xs text-gray-300 font-bold">CVV</p>
                    <p class="text-xs text-white font-bold tracking-wider">***</p>
                </div>
                <div>
                    <img src="https://img.icons8.com/offices/80/000000/sim-card-chip.png" width="48"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'CardComponent'
}
</script>