import { useEffect, useState } from 'react';

export type ThemeName = 'light' | 'dark';

function useTheme() {
  const rootStyle = document.documentElement.style;
  const [themeName, setThemeName] = useState<ThemeName>('light');
  const changeTheme = () => {
    if (themeName === 'light') {
      setThemeName('dark');
      setTimeout(() => {
        rootStyle.setProperty('--main-background-color', '#0a0a0a');
        rootStyle.setProperty('--main-font-color', '#fff');
        rootStyle.setProperty('--active-background-color', 'hsl(0deg 0% 100% / 4%)');
        rootStyle.setProperty('--main-icon-color', '#fff');
      }, 300);
    } else {
      setThemeName('light');
      setTimeout(() => {
        rootStyle.setProperty('--main-background-color', '#fff');
        rootStyle.setProperty('--main-font-color', '#0a0a0a');
        rootStyle.setProperty('--active-background-color', 'rgb(0 0 0 / 6%)');
        rootStyle.setProperty('--main-icon-color', '#0a0a0a');
      }, 300);
    }
  };
  useEffect(() => {
    //设置初始皮肤
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeName('dark');
    } else {
      setThemeName('light');
    }
    //监听系统颜色切换
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (event.matches) {
        setThemeName('dark');
        setTimeout(() => {
          rootStyle.setProperty('--main-background-color', '#0a0a0a');
          rootStyle.setProperty('--main-font-color', '#fff');
          rootStyle.setProperty('--active-background-color', 'hsl(0deg 0% 100% / 4%)');
          rootStyle.setProperty('--main-icon-color', '#fff');
        }, 300);
      } else {
        setThemeName('light');
        setTimeout(() => {
          rootStyle.setProperty('--main-background-color', '#fff');
          rootStyle.setProperty('--main-font-color', '#0a0a0a');
          rootStyle.setProperty('--active-background-color', 'rgb(0 0 0 / 6%)');
          rootStyle.setProperty('--main-icon-color', '#0a0a0a');
        }, 300);
      }
    });
  }, [rootStyle]);
  return {
    themeName,
    isDarkMode: themeName === 'dark',
    isLightMode: themeName === 'light',
    changeTheme
  };
}

export default useTheme;
