<template>
  <v-app class="bg-background">
    <router-view v-slot="{ Component }">
      <v-fade-transition hide-on-leave>
        <component :is="Component" />
      </v-fade-transition>
    </router-view>
  </v-app>
</template>

<style>
/* Global aesthetics like custom scrollbar or reset */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #0a0e17;
}
::-webkit-scrollbar-thumb {
  background: #00e676;
}
</style>
