<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import data1 from "../lottie/v1/lottie.json?lottie";
import LottieWeb from "lottie-web";
import { onMounted } from "vue";

onMounted(async () => {
  const c1 = document.getElementById("canvas1")!;
  setTimeout(async () => {
    const c2 = document.getElementById("canvas2")!;
    const { default: data } = await import("../lottie/v2/data.json?lottie");
    console.log("url", data);
    LottieWeb.loadAnimation({
      container: c2, // the dom element that will contain the animation
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: data,
    });
  }, 2000);
  LottieWeb.loadAnimation({
    container: c1, // the dom element that will contain the animation
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: data1,
  });
});
</script>

<template>
  <div id="canvas1"></div>
  <div id="canvas2"></div>
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
