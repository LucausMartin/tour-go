import { FC, useState, useEffect, useRef } from 'react';
import { ReactSetState } from '@myTypes/type.ts';
import { daley } from '@myCommon/daley.ts';
import { MdArrowBackIos, MdOutlineSearch } from 'react-icons/md';
import './searchPage.css';

const SearchPage: FC<{ searchPageShow: boolean; setSearchPageShow: ReactSetState<boolean> }> = ({
  searchPageShow,
  setSearchPageShow
}) => {
  const [daleyAnimation, setdaleyAnimation] = useState(false);

  // 控制渐入渐出动画
  useEffect(() => {
    if (!searchPageShow) {
      daley(180).then(() => {
        setdaleyAnimation(false);
      });
    } else {
      setdaleyAnimation(true);
    }
  }, [searchPageShow]);

  return (
    <div
      style={{
        opacity: searchPageShow ? '1' : '0',
        zIndex: daleyAnimation ? '1' : '-1'
      }}
      className="discover-search-page-container"
    >
      <TopBar setSearchPageShow={setSearchPageShow} searchPageShow={searchPageShow} />
      <Content />
    </div>
  );
};
export { SearchPage };

const TopBar: FC<{ setSearchPageShow: ReactSetState<boolean>; searchPageShow: boolean }> = ({
  setSearchPageShow,
  searchPageShow
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchPageShow && inputRef.current) {
      inputRef.current!.focus();
    }
  }, [searchPageShow]);

  return (
    <div className="discover-search-page-top-bar">
      <MdArrowBackIos
        onClick={() => setSearchPageShow(false)}
        className="discover-search-page-back discover-search-page-icon"
      />
      <div className="discover-search-page-input-container">
        <MdOutlineSearch className="discover-search-page-search discover-search-page-icon" />
        <input ref={inputRef} className="discover-search-page-input" type="text" />
        <span className="discover-search-page-font">搜索</span>
      </div>
    </div>
  );
};

const Content: FC = () => {
  return <div className="discover-search-page-content-container">123</div>;
};
