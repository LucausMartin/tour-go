import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './navigate.css';
// 导航烂可点的选项
import { NavList, NavListKeys } from './types.ts';
import { useWindowSize } from '@uidotdev/usehooks';

export const NavigateBar: FC = () => {
  const windowSize = useWindowSize();
  // 系统主题色 light 或者 dark
  const navigate = useNavigate();

  // 导航路径状态
  const [navState, setNavState] = useState<NavListKeys>(NavList[0].key);

  const navToPage = (pageRoute: NavListKeys) => {
    return () => {
      setNavState(pageRoute);
      navigate(`/home/${pageRoute}`);
    };
  };

  return (
    <nav className="home-nav">
      <div className="nav-logo">
        <h1>logo</h1>
      </div>
      {/* 根据 NavList 生成导航栏的 element，如要添加直接配置 NavList */}
      {NavList.map(item =>
        // 更多选项特殊处理
        item.key === 'more' ? (
          <div
            className="nav-more"
            key={item.key}
            style={{
              backgroundColor: navState === item.key ? 'var(--active-background-color)' : ''
            }}
          >
            <div className="nav-list-content">
              <item.icon className="nav-icon" />
              <span>{item.title}</span>
            </div>
          </div>
        ) : (
          <div
            key={item.key}
            className="nav-list"
            onClick={navToPage(item.key)}
            style={{
              backgroundColor:
                windowSize.width && windowSize.width >= 900 && navState === item.key
                  ? 'var(--active-background-color)'
                  : '',
              color:
                windowSize.width && windowSize.width < 900 && navState === item.key ? 'var(--active-font-color)' : ''
            }}
          >
            <div className="nav-list-content">
              <item.icon
                className="nav-icon"
                style={{
                  color:
                    windowSize.width && windowSize.width < 900 && navState === item.key
                      ? 'var(--active-font-color)'
                      : ''
                }}
              />
              <span>{item.title}</span>
            </div>
          </div>
        )
      )}
    </nav>
  );
};
