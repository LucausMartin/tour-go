import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import './navigate.css';
// 导航烂可点的选项
import { NavList, NavListKeys } from './types.ts';
import { useWindowSize } from '@uidotdev/usehooks';
import { useMatchLocation } from '@hooks/useMatchLocation.ts';

export const NavigateBar: FC = () => {
  const location = useMatchLocation('navigate');

  const windowSize = useWindowSize();
  const navigate = useNavigate();

  const navToPage = (pageRoute: NavListKeys) => {
    return () => {
      navigate(`/home/${pageRoute}`);
      if (pageRoute === 'discover') {
        navigate(`/home/${pageRoute}/recommand`);
      }
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
              backgroundColor: location === item.key ? 'var(--active-background-color)' : ''
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
                windowSize.width && windowSize.width >= 900 && location === item.key
                  ? 'var(--active-background-color)'
                  : '',
              color:
                windowSize.width && windowSize.width < 900 && location === item.key ? 'var(--active-font-color)' : ''
            }}
          >
            <div className="nav-list-content">
              <item.icon
                className="nav-icon"
                style={{
                  color:
                    windowSize.width && windowSize.width < 900 && location === item.key
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
