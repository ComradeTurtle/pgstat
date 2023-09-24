<script setup>
const challengeDropdown = useState("challengeDropdown");

const tableContent = useState("tableContent");
const tableColumns = useState("tableColumns");

const lastUpdate = useState("lastUpdate");
const isStarting = useState("isStarting");
const appVersion = useState("appVersion");
const updCountdown = useState("updCountdown");

const q = ref("");

const filteredContent = computed(() => {
if (q.value.length < 1) return tableContent.value;
  return tableContent.value.filter((row) => {
    return Object.values(row).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

const dropdownUI = {
  width: 'w-fit',
  height: 'max-h-[65vh]',
  padding: 'p-2'
}

onMounted(() => {
  if (useState("updInterval").value) {
    clearInterval(useState("updInterval").value);
    console.log(`interval cleared index.vue`);
  }

  getStatistics();
  getValues('indiv');
})

onUnmounted(() => {
  if (useState("updInterval").value) {
    clearInterval(useState("updInterval").value);
    console.log(`interval cleared index.vue`);
  }
})
</script>
<template>
  <StructuresFlex column items="center" class="gap-2">
    <p class="italic">Very Work In Progress. Feature request? Bug? Question? Please contact me on Discord at @comradeturtle or <a class="hover:text-primary-500 before:bg-primary-500 relative cursor-pointer font-semibold transition-colors before:absolute before:-bottom-1 before:-left-0.5 before:h-0.5 before:w-0 before:rounded before:transition-[width] before:duration-300 before:hover:w-full" href="mailto:giorgosd1300@shadowct.eu">click here</a></p>
    <p class="italic"><a class="hover:text-primary-500 before:bg-primary-500 relative font-semibold cursor-pointer transition-colors before:absolute before:-bottom-1 before:-left-0.5 before:h-0.5 before:w-0 before:rounded before:transition-[width] before:duration-300 before:hover:w-full" v-if="appVersion !== 'Loading..'" :href="`https://github.com/ComradeTurtle/pgstat/releases/tag/${appVersion}`">Current version: {{ appVersion }}</a></p>

    <UDropdown :items="challengeDropdown" :popper="{ placement: 'bottom' }" :ui="dropdownUI" class="overflow-y-auto">
      <UButton color="white" size="lg" label="Options" trailing-icon="i-mdi-chevron-down">{{ useState("dropdownLabel").value }}</UButton>
    </UDropdown>

    <StructuresFlex column class="overflow-x-auto w-full lg:w-auto">
      <UInput v-model="q" placeholder="Search Username / Team Name" />
      <h1 v-if="isStarting" class="pt-2 text-center">{{ lastUpdate === 0 ? 'Waiting for updates..' : `Last Update: ${new Date(lastUpdate).toLocaleString()}` }} {{ updCountdown !== -1 ? `(Next update in ${getMinutes(updCountdown)})` : '' }}</h1>
      <UTable v-if="![null, undefined].includes(tableColumns)" :rows="filteredContent" :columns="tableColumns" :empty-state="{ icon: 'i-mdi-database-remove', label: 'No items. If the challenge is starting soon, please allow the server some time to update. Statistics are renewed every 15 minutes.'}">
      </UTable>
    </StructuresFlex>
  </StructuresFlex>
</template>
