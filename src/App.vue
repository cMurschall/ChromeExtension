<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MainView from './components/MainView.vue'

import logo from './assets/logo.png';
const logoUrl = chrome.runtime.getURL(logo);
</script>

<template>
  <!-- <img alt="Vue logo" :src="logoUrl" /> -->
  <MainView />
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
