<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import data1 from "../lottie/v1/lottie.json?lottie";
import LottieWeb from "lottie-web";
import { onMounted } from "vue";

onMounted(async () => {
  const c = document.getElementById("canvas")!;
  setTimeout(async () => {
    const url = await import("../lottie/v2/data.json?lottie");
    console.log("url", url);
  }, 2000);
  LottieWeb.loadAnimation({
    container: c, // the dom element that will contain the animation
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: data1,
  });
});
</script>

<template>
  <div id="canvas"></div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
