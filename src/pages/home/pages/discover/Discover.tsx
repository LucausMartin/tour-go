import { FC, useEffect, useRef, useState } from 'react';
import './discover.css';
import { MdOutlineSearch } from 'react-icons/md';
import { ThemeButton } from '@myComponents/ThemeButton/ThemeButton.tsx';
import { Space } from '@myComponents/Space/Space.tsx';
import { KindList, KindKeys } from './type.ts';
import { ReactSetState } from '@myTypes/type.ts';
import { useWindowSize } from '@uidotdev/usehooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useMatchLocation } from '@myHooks/useMatchLocation.ts';
import { SearchPage } from './pages/SearchPage.tsx';

// const a = [...new Array(29).keys()];
// const webpPath = '/src/assets/img';

const Discover: FC = () => {
  const windowSize = useWindowSize();
  const [searchPageShow, setSearchPageShow] = useState(false);
  return (
    <div className="discover-container">
      {windowSize.width && windowSize.width >= 900 ? (
        <>
          <DiscoverSearch />
          <Space width="100%" height="60px" />
          <DiscoverKind />
        </>
      ) : (
        <>
          <DiscoverTopBar setSearchPageShow={setSearchPageShow} />
          <SearchPage searchPageShow={searchPageShow} setSearchPageShow={setSearchPageShow} />
        </>
      )}
      <ThemeButton display={windowSize.width && windowSize.width >= 900 ? true : false} />
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useMatchLocation('articleKind');
  const naivgate = useNavigate();

  const changeKind = (kindKey: KindKeys) => {
    return () => {
      naivgate(`${kindKey}`);
    };
  };

  return (
    <div ref={scrollRef} className="discover-kind">
      {KindList.map(item => {
        return (
          <div
            key={item.key}
            onClick={changeKind(item.key)}
            style={{
              backgroundColor: location === item.key ? 'var(--active-background-color)' : '',
              color: location === item.key ? 'var(--active-font-color)' : '',
              fontWeight: location === item.key ? '600' : ''
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

const DiscoverTopBar: FC<{ setSearchPageShow: ReactSetState<boolean> }> = ({ setSearchPageShow }) => {
  const location = useMatchLocation('articleKind');
  const naivgate = useNavigate();
  const kindListElementWidth = useRef<number>(0);

  useEffect(() => {
    // 计算类别列表UI的宽度
    kindListElementWidth.current = KindList.reduce((pre, cur) => {
      return pre + cur.title.length * 16 + 18;
    }, -18);
  }, []);

  const windowSize = useWindowSize();
  const [endState, setEndState] = useState(false);
  const [startState, setStartState] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const changeKind = (kindKey: KindKeys) => {
    return () => {
      naivgate(`${kindKey}`);
    };
  };

  const onScrollHandle = () => {
    const scrollLeft = rootRef.current?.scrollLeft;
    const scrollWidth = rootRef.current?.scrollWidth;
    const clientWidth = rootRef.current?.clientWidth;
    if (scrollLeft === 0) {
      setStartState(true);
    } else {
      setStartState(false);
    }
    if (scrollLeft && clientWidth && scrollWidth && scrollLeft + clientWidth >= scrollWidth - 5) {
      setEndState(true);
    } else {
      setEndState(false);
    }
  };

  return (
    <div className="discover-top-bar">
      <div ref={rootRef} id="rootRef" className="discover-top-bar-list" onScrollCapture={onScrollHandle}>
        {windowSize.width && windowSize.width - 65 <= kindListElementWidth.current ? (
          startState ? null : (
            <div className="discover-top-bar-list-left-mask"></div>
          )
        ) : null}
        {KindList.map(item => (
          <div
            key={item.key}
            className="discover-top-bar-list-item"
            onClick={changeKind(item.key)}
            style={{
              fontWeight: location === item.key ? '600' : '',
              color: location === item.key ? 'var(--active-font-color)' : ''
            }}
          >
            {item.title}
          </div>
        ))}
        <div
          className="discover-top-bar-list-right-mask"
          style={{
            display:
              windowSize.width && windowSize.width - 65 <= kindListElementWidth.current
                ? endState
                  ? 'none'
                  : 'block'
                : 'none',
            left:
              windowSize.width && windowSize.width - 65 <= kindListElementWidth.current
                ? ''
                : kindListElementWidth.current - 22 + 'px',
            right: windowSize.width && windowSize.width - 65 <= kindListElementWidth.current ? '57px' : ''
          }}
        ></div>
      </div>
      <div className="discover-top-bar-search" onClick={() => setSearchPageShow(true)}>
        <MdOutlineSearch className="discover-top-bar-search-icon" />
      </div>
    </div>
  );
};

const DiscoverContent: FC = () => {
  const param = useParams();
  return <div className="discover-content">{param.kind}</div>;
};

export { Discover, DiscoverContent };
