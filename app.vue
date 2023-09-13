<script setup>
useState("tableContent", () => []);
useState("tableColumns", () => []);
useState("challengeDropdown", () => []);
useState("dropdownLabel", () => "Challenge List");
useState("lastUpdate", () => 0);
useState("isStarting", () => false);
useState("appVersion", () => "Loading..");

useHead({
  htmlAttrs: {
    lang: "en-us",
  },
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap",
    },
  ],
});
</script>

<template>
  <Nav />
  <NuxtPage />
</template>
