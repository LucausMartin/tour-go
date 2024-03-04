import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import './navigate.css';
import { NavList, NavListKeys } from './types.ts';
import { useWindowSize } from '@uidotdev/usehooks';
import { useMatchLocation } from '@myHooks/useMatchLocation.ts';
import { FavoriteBorderOutlined, GradeOutlined, MarkChatUnreadOutlined } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { selectLogin, readyLoginAction } from '@myStore/slices/loginSlice.ts';

export const NavigateBar: FC = () => {
  const loginState = useSelector(selectLogin);
  const dispatch = useDispatch();
  const location = useMatchLocation('navigate');

  const windowSize = useWindowSize();
  const navigate = useNavigate();

  const navToPage = (pageRoute: NavListKeys) => {
    return () => {
      if (loginState === 'logout' && pageRoute === 'me') {
        dispatch(readyLoginAction());
        return;
      }
      if (pageRoute !== 'discover' && loginState === 'logout') {
        dispatch(readyLoginAction());
        return;
      }
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
        ) : item.key === 'me' ? (
          loginState === 'login' ? (
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
          ) : windowSize.width && windowSize.width < 900 ? (
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
          ) : (
            <div key={item.key} className="nav-list nav-login" onClick={() => dispatch(readyLoginAction())}>
              登录
            </div>
          )
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
      <div className="nav-recommand-login">
        <div style={{ color: 'var(--main-font-color)', fontSize: '15px' }}>登录即得</div>
        <div>
          <FavoriteBorderOutlined style={{ fontSize: '14px', marginRight: '3px', position: 'relative', top: '1px' }} />
          更懂你的优质内容
        </div>
        <div>
          <GradeOutlined
            style={{ fontSize: '17px', marginRight: '0px', position: 'relative', top: '2.5px', left: '-1.7px' }}
          />
          点赞收藏不会迷路
        </div>
        <div>
          <MarkChatUnreadOutlined style={{ fontSize: '14px', marginRight: '3px', position: 'relative', top: '3px' }} />
          与他人更高效互动
        </div>
      </div>
    </nav>
  );
};
