<template>
  <div id="app-component"></div>
</template>

<script>
export default {
  setup() {
    console.log("app setup, fetching /api/sites JSON...");
    fetch("http://localhost:8000/api/sites").then((response) => {
      response.json().then((sites) => console.log(sites));
    });
    return {};
  },
};
</script>

<style>
</style>