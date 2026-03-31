import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export interface ThemeConfig {
  id: string
  name: string
  wallpaper: string
  /** CSS variable overrides */
  vars: Record<string, string>
}

export const THEMES: Record<string, ThemeConfig> = {
  theme_wood1: {
    id: 'theme_wood1',
    name: '木纹典雅',
    wallpaper: 'linear-gradient(180deg, #a6d8fb 0%, #7dbcea 40%, #5a96d1 100%)',
    vars: {
      '--shell-bg': '#6ba6d8',
      '--glass-white': 'rgba(255, 255, 255, 0.7)',
      '--glass-strong': 'rgba(255, 255, 255, 0.88)',
      '--line-soft': 'rgba(255, 255, 255, 0.32)',
      '--line-strong': 'rgba(34, 84, 136, 0.28)',
      '--shadow-shell': '0 18px 60px rgba(16, 52, 95, 0.28)',
      '--color-primary': '#2d5f8f',
      '--color-primary-light': '#4a9de8',
      '--color-primary-hover': '#5fb3f6',
      '--color-text': '#1f2d3d',
      '--color-text-secondary': '#3a648f',
      '--color-text-muted': 'rgba(45, 95, 143, 0.58)',
      '--color-accent': '#5fb3f6',
    },
  },
  theme_night: {
    id: 'theme_night',
    name: '夜间模式',
    wallpaper: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
    vars: {
      '--shell-bg': '#0f3460',
      '--glass-white': 'rgba(30, 40, 70, 0.75)',
      '--glass-strong': 'rgba(30, 40, 70, 0.92)',
      '--line-soft': 'rgba(80, 110, 160, 0.3)',
      '--line-strong': 'rgba(80, 110, 160, 0.4)',
      '--shadow-shell': '0 18px 60px rgba(0, 0, 0, 0.5)',
      '--color-primary': '#5fb3f6',
      '--color-primary-light': '#4a9de8',
      '--color-primary-hover': '#7cc3ff',
      '--color-text': '#c8d6e5',
      '--color-text-secondary': '#a0b4c8',
      '--color-text-muted': 'rgba(160, 180, 200, 0.5)',
      '--color-accent': '#5fb3f6',
    },
  },
  theme_classic_blue: {
    id: 'theme_classic_blue',
    name: '经典蓝调',
    wallpaper: 'linear-gradient(180deg, #e8f4fd 0%, #c2d9f5 40%, #8bb8e8 100%)',
    vars: {
      '--shell-bg': '#8bb8e8',
      '--glass-white': 'rgba(240, 248, 255, 0.65)',
      '--glass-strong': 'rgba(240, 248, 255, 0.85)',
      '--line-soft': 'rgba(200, 220, 255, 0.4)',
      '--line-strong': 'rgba(100, 150, 210, 0.3)',
      '--shadow-shell': '0 18px 60px rgba(60, 100, 160, 0.22)',
      '--color-primary': '#2563a8',
      '--color-primary-light': '#3b82c4',
      '--color-primary-hover': '#4fa0d8',
      '--color-text': '#1a3a60',
      '--color-text-secondary': '#2a5a90',
      '--color-text-muted': 'rgba(40, 80, 140, 0.5)',
      '--color-accent': '#4fa0d8',
    },
  },
}

export const useThemeStore = defineStore('theme', () => {
  const themeId = ref('theme_wood1')

  const applyTheme = () => {
    const root = document.documentElement
    const config = THEMES[themeId.value] ?? THEMES.theme_wood1

    root.dataset.theme = themeId.value
    root.style.setProperty('--desktop-wallpaper', config.wallpaper)

    for (const [key, value] of Object.entries(config.vars)) {
      root.style.setProperty(key, value)
    }
  }

  const setTheme = (nextThemeId: string) => {
    if (THEMES[nextThemeId]) {
      themeId.value = nextThemeId
      localStorage.setItem('webqq-rebuild.theme', nextThemeId)
      applyTheme()
    }
  }

  const currentTheme = () => THEMES[themeId.value] ?? THEMES.theme_wood1

  const savedThemeId = localStorage.getItem('webqq-rebuild.theme')
  if (savedThemeId && THEMES[savedThemeId]) {
    themeId.value = savedThemeId
  }

  watch(themeId, applyTheme, { immediate: true })

  return {
    themeId,
    setTheme,
    currentTheme,
    THEMES,
  }
})
