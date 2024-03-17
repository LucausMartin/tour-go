import { FC, useEffect, useRef, useState } from 'react';
import './discover.css';
import { MdOutlineSearch } from 'react-icons/md';
import { Space } from '@myComponents/Space/Space.tsx';
import { discoverKindList, KindKeys } from './types.ts';
import { ReactSetState } from '@myTypes/types.ts';
import { useWindowSize } from '@uidotdev/usehooks';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { useMatchLocation } from '@myHooks/useMatchLocation.ts';
import { MaskDialog } from '@myComponents/MaskDialog/MaskDialog.tsx';
import { LoginPopUps } from '../../../login/Login.tsx';
import { useSelector } from 'react-redux';
import { selectLogin } from '@myStore/slices/loginSlice.ts';
import { FavoriteBorder } from '@mui/icons-material';
import image1 from '../../../../assets/img/1.webp';
import avatar from '../../../../assets/avatar.jpg';
import { useLoginState } from '@myHooks/useLoginState.ts';

// const a = [...new Array(29).keys()];
// const webpPath = '/src/assets/img';

// const data = [
//   {
//     imgSrc: '/src/assets/img/1.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/2.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/3.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/4.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/5.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/6.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/7.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/8.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/9.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/10.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/11.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/12.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/13.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/14.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/15.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/16.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/17.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/18.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/19.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/20.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/21.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/22.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/23.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/24.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/25.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/26.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/27.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/28.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/29.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/30.webp'
//   }
// ];

// const data2 = [
//   {
//     imgSrc: '/src/assets/img/31.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/32.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/33.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/34.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/35.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/36.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/37.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/38.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/39.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/40.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/41.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/42.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/43.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/44.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/45.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/46.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/47.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/48.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/49.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/50.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/51.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/52.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/53.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/54.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/55.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/56.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/57.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/58.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/59.webp'
//   },
//   {
//     imgSrc: '/src/assets/img/60.webp'
//   }
// ];

const Discover: FC = () => {
  useLoginState();
  const loginState = useSelector(selectLogin);
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
      <Outlet />
      {loginState === 'ready' ? <LoginPopUps /> : <></>}
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
  return (
    <div className="discover-content">
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
      <DiscoverContentItem articleID="1" userName="1"></DiscoverContentItem>
    </div>
  );
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

const DiscoverContentItem: FC<{ articleID: string; userName: string }> = ({ articleID, userName }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [avatarSrc, setAvatarSrc] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [name, setName] = useState<string>(userName);
  const [likeNumber, setLikeNumber] = useState<string>('');

  useEffect(() => {
    // fetch data
    setImgSrc(image1);
    setAvatarSrc(avatar);
    setDescription('descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription');
    setName('其实就是一个用户名，but长一点');
    setLikeNumber('10');
  }, [articleID]);
  return (
    <div className="discover-content-item">
      <img src={imgSrc} className="discover-content-item-cover" alt="image" />
      <div className="discover-content-item-info">
        <div className="discover-content-item-description">{description}</div>
        <div className="discover-content-item-article-info">
          <div className="discover-content-item-article-author">
            <img src={avatarSrc} className="discover-content-item-article-author-avatar" alt="avatar" />
            <div className="discover-content-item-article-author-name">{name}</div>
          </div>
          <div className="discover-content-item-author-like">
            <FavoriteBorder className="discover-content-item-author-like-icon" />
            <div className="discover-content-item-author-like-number">{likeNumber}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Discover, DiscoverContent };
