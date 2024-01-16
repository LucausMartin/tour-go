import { useEffect, useState } from 'react';

export type ThemeName = 'light' | 'dark';

function useTheme() {
  const [themeName, setThemeName] = useState<ThemeName>('light');
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
      } else {
        setThemeName('light');
      }
    });
  }, []);
  return {
    themeName,
    isDarkMode: themeName === 'dark',
    isLightMode: themeName === 'light'
  };
}

export default useTheme;
