<template>
  <div class="app">
    <GlobalNavBar />
    <main class="flex-grow">
      <router-view />
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import GlobalNavBar from './components/GlobalNavBar.vue';

export default defineComponent({
  name: 'App',
  components: {
    GlobalNavBar
  }
});
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 全局样式 */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

router-view {
  flex: 1;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
</style> 