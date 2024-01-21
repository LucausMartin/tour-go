import { FC, useState } from 'react';
import './discover.css';
import { MdOutlineSearch } from 'react-icons/md';
import { ThemeButton } from '@components/ThemeButton/ThemeButton.tsx';
import { Space } from '@components/Space/Space.tsx';
import { KindList, KindKeys } from './type.ts';
import { useWindowSize } from '@uidotdev/usehooks';

// const a = [...new Array(29).keys()];
// const webpPath = '/src/assets/img';

const Discover: FC = () => {
  const windowSize = useWindowSize();
  return (
    <div className="discover-container">
      {windowSize.width && windowSize.width >= 900 ? (
        <>
          <DiscoverSearch />
          <ThemeButton />
          <Space width="100%" height="60px" />
          <DiscoverKind />
        </>
      ) : (
        <>
          <DiscoverTopBar></DiscoverTopBar>
        </>
      )}
      <DiscoverContent />
    </div>
  );
};

const DiscoverSearch: FC = () => {
  return (
    <div className="discover-search-container">
      <input className="discover-search" placeholder="搜索旅游攻略" />
      <MdOutlineSearch className="discover-search-icon" />
    </div>
  );
};

const DiscoverKind: FC = () => {
  const [kindState, setKindState] = useState<KindKeys>(KindList[0].key);

  const changeKind = (kind: KindKeys) => {
    return () => {
      setKindState(kind);
    };
  };

  return (
    <div className="discover-kind">
      {KindList.map(item => {
        return (
          <div
            key={item.key}
            onClick={changeKind(item.key)}
            style={{
              backgroundColor: kindState === item.key ? 'var(--active-background-color)' : '',
              color: kindState === item.key ? 'var(--main-font-color)' : '',
              fontWeight: kindState === item.key ? '600' : ''
            }}
            className="discover-kind-item"
          >
            {item.title}
          </div>
        );
      })}
    </div>
  );
};

const DiscoverContent: FC = () => {
  return (
    <div className="discover-content">
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
    </div>
  );
};

const DiscoverTopBar: FC = () => {
  const [kindState, setKindState] = useState<KindKeys>(KindList[0].key);

  const changeKind = (kind: KindKeys) => {
    return () => {
      setKindState(kind);
    };
  };

  return (
    <div className="discover-top-bar">
      <div className="discover-top-bar-list">
        {KindList.map(item => (
          <div
            key={item.key}
            className="discover-top-bar-list-item"
            onClick={changeKind(item.key)}
            style={{
              fontWeight: kindState === item.key ? '600' : '',
              color: kindState === item.key ? 'var(--main-font-color)' : ''
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className="discover-top-bar-search">
        <MdOutlineSearch className="discover-top-bar-search-icon" />
      </div>
    </div>
  );
};
export { Discover };
