import { FC, useEffect, useRef, useState } from 'react';
import './discover.css';
import { MdOutlineSearch } from 'react-icons/md';
import { Space } from '@myComponents/Space/Space.tsx';
import { discoverKindList, KindKeys } from './types.ts';
import { ReactSetState } from '@myTypes/types.ts';
import { useWindowSize } from '@uidotdev/usehooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useMatchLocation } from '@myHooks/useMatchLocation.ts';
import { MaskDialog } from '@myComponents/MaskDialog/MaskDialog.tsx';

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
  const param = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const naivgate = useNavigate();

  const changeKind = (kindKey: KindKeys) => {
    return () => {
      naivgate(`${kindKey}`);
    };
  };

  return (
    <div ref={scrollRef} className="discover-kind">
      {discoverKindList.map(item => {
        return (
          <div
            key={item.key}
            onClick={changeKind(item.key)}
            style={{
              backgroundColor: param.kind === item.key ? 'var(--active-background-color)' : '',
              color: param.kind === item.key ? 'var(--active-font-color)' : '',
              fontWeight: param.kind === item.key ? '600' : ''
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

// 以下是移动端适配
const DiscoverTopBar: FC<{ setSearchPageShow: ReactSetState<boolean> }> = ({ setSearchPageShow }) => {
  const location = useMatchLocation('articleKind');
  const naivgate = useNavigate();
  const discoverKindListElementWidth = useRef<number>(0);

  useEffect(() => {
    // 计算类别列表UI的宽度
    discoverKindListElementWidth.current = discoverKindList.reduce((pre, cur) => {
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
        {windowSize.width && windowSize.width - 65 <= discoverKindListElementWidth.current ? (
          startState ? null : (
            <div className="discover-top-bar-list-left-mask"></div>
          )
        ) : null}
        {discoverKindList.map(item => (
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
              windowSize.width && windowSize.width - 65 <= discoverKindListElementWidth.current
                ? endState
                  ? 'none'
                  : 'block'
                : 'none',
            left:
              windowSize.width && windowSize.width - 65 <= discoverKindListElementWidth.current
                ? ''
                : discoverKindListElementWidth.current - 22 + 'px',
            right: windowSize.width && windowSize.width - 65 <= discoverKindListElementWidth.current ? '57px' : ''
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

const SearchPage: FC<{ searchPageShow: boolean; setSearchPageShow: ReactSetState<boolean> }> = ({
  searchPageShow,
  setSearchPageShow
}) => {
  // 为了满足封装的需求同时使用 inputvalue
  const Content: FC<{ inputvalue?: string }> = ({ inputvalue }) => {
    return <div>{inputvalue}</div>;
  };

  return (
    <MaskDialog maskShow={searchPageShow} setMaskShow={setSearchPageShow}>
      <Content />
    </MaskDialog>
  );
};

export { Discover, DiscoverContent };
