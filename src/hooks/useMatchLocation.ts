import { useLocation } from 'react-router-dom';

type LocationKind = 'navigate' | 'articleKind';

const useMatchLocation = (locationKind: LocationKind) => {
  if (locationKind !== 'navigate' && locationKind !== 'articleKind') {
    throw new Error('locationKind must be "navigate" or "articleKind"');
  }

  const location = useLocation();

  if (locationKind === 'navigate') {
    // 取出 home/ 这个字符串之后 / 字符串之前的内容, 如果没有匹配到, 则 取出 home/ 这个字符串之后 的内容
    const match = location.pathname.match(/home\/(.*?)\//);
    if (match) {
      return match[1];
    } else {
      const match = location.pathname.match(/home\/(.*)/);
      return match ? match[1] : '';
    }
  }

  if (locationKind === 'articleKind') {
    // 取出 discover/ 这个字符串之后的内容
    const match = location.pathname.match(/discover\/(.*)/);
    return match ? match[1] : '';
  }

  return '';
};

export { useMatchLocation };
