import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAccountCircle, MdOutlineAccountBalance, MdOutlineReorder, MdAddCircleOutline } from 'react-icons/md';
import './navigate.css';

// 枚举类型
enum NavList {
  discover = 'discover',
  publish = 'publish',
  me = 'me',
  more = 'more'
}
export const NavigateBar: FC = () => {
  const navigate = useNavigate();
  const [navState, setNavState] = useState<NavList>(NavList.discover);

  const navToDiscover = () => {
    setNavState(NavList.discover);
    navigate('/');
  };

  const navToPublish = () => {
    setNavState(NavList.publish);
    navigate('/home/publish');
  };

  const navToMe = () => {
    setNavState(NavList.me);
    navigate('/home/me');
  };

  return (
    <>
      <nav className="home-nav">
        <div className="nav-logo">
          <h1>logo</h1>
        </div>
        <div
          className="nav-list"
          onClick={navToDiscover}
          style={{
            backgroundColor: navState === NavList.discover ? '#e1e1e1' : 'var(--main-background-color)'
          }}
        >
          <div className="nav-list-content">
            <MdOutlineAccountBalance className="nav-icon" />
            <span>发现</span>
          </div>
        </div>
        <div className="nav-list" onClick={navToPublish}>
          <div className="nav-list-content">
            <MdAddCircleOutline className="nav-icon" />
            发布
          </div>
        </div>
        <div className="nav-list" onClick={navToMe}>
          <div className="nav-list-content">
            <MdOutlineAccountCircle className="nav-icon" />
            <span>我</span>
          </div>
        </div>
        <div className="nav-more">
          <div className="nav-list-content">
            <MdOutlineReorder className="nav-icon" />
            <span>设置</span>
          </div>
        </div>
      </nav>
    </>
  );
};
