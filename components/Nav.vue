<script setup>
const route = useRoute();
const menu = ref(false);

const pages = [
  {
    name: 'Users',
    to: '/'
  },
  {
    name: 'Teams',
    to: '/teams'
  }
]

onBeforeRouteLeave(() => {
  menu.value = false;
})
</script>

<template>
  <StructuresFlex is="nav" row items="center" justify="between" class="p-4">
    <StructuresFlex row items="center" class="gap-6">
      <NuxtLink to="/">
        <h1 class="text-xl font-medium">PG Challenges</h1>
      </NuxtLink>

      <StructuresFlex row items="center" class="gap-4">
        <StructuresFlex
          v-for="page in pages" router :to="page.to" row items="center" class="hover:text-primary-500 gap-1 transition-colors">
          <span :class="{ 'text-primary-300': route.path === page.to }">{{ page.name }}</span>
        </StructuresFlex>
      </StructuresFlex>
    </StructuresFlex>
  </StructuresFlex>
</template>