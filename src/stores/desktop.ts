import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useDesktopStore = defineStore('desktop', () => {
  const sidebarOpen = ref(true)
  const wallpaper = ref('var(--desktop-wallpaper, linear-gradient(180deg, #a6d8fb 0%, #7dbcea 40%, #5a96d1 100%))')

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const toggleBarTitle = computed(() => (sidebarOpen.value ? '隐藏侧边栏' : '打开侧边栏'))

  return {
    sidebarOpen,
    wallpaper,
    toggleSidebar,
    toggleBarTitle,
  }
})
