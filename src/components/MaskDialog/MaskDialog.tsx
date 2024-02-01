import { FC, useState, useEffect, useRef, ReactElement, cloneElement } from 'react';
import { ReactSetState } from '@myTypes/types.ts';
import { daley } from '@myCommon/daley.ts';
import { MdArrowBackIos, MdOutlineSearch } from 'react-icons/md';
import './maskDialog.css';

const MaskDialog: FC<{
  maskShow: boolean;
  setMaskShow: ReactSetState<boolean>;
  children: ReactElement;
  showSearch?: boolean;
}> = ({ maskShow, setMaskShow, showSearch = true, children }) => {
  const [daleyAnimation, setdaleyAnimation] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  // 控制渐入渐出动画
  useEffect(() => {
    if (!maskShow) {
      daley(180).then(() => {
        setdaleyAnimation(false);
      });
    } else {
      setdaleyAnimation(true);
    }
  }, [maskShow]);

  return (
    <div
      style={{
        opacity: maskShow ? '1' : '0',
        zIndex: daleyAnimation ? '1' : '-1'
      }}
      className="mask-dialog-container"
    >
      <TopBar setInputValue={setInputValue} setMaskShow={setMaskShow} maskShow={maskShow} showSearch={showSearch} />
      <Content inputvalue={inputValue} children={children} />
    </div>
  );
};

const TopBar: FC<{
  setMaskShow: ReactSetState<boolean>;
  maskShow: boolean;
  showSearch: boolean;
  setInputValue: ReactSetState<string>;
}> = ({ setMaskShow, maskShow, showSearch, setInputValue }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    if (maskShow && inputRef.current) {
      inputRef.current!.focus();
    }
  }, [maskShow]);

  return (
    <div className="discover-search-page-top-bar">
      <MdArrowBackIos
        onClick={() => setMaskShow(false)}
        className="discover-search-page-back discover-search-page-icon"
      />
      {showSearch && (
        <div className="discover-search-page-input-container">
          <MdOutlineSearch className="discover-search-page-search discover-search-page-icon" />
          <input
            ref={inputRef}
            onChange={e => {
              setSearchValue(e.target.value);
            }}
            className="discover-search-page-input"
            type="text"
          />
          <span
            className="discover-search-page-font"
            onClick={() => {
              setInputValue(searchValue);
            }}
          >
            搜索
          </span>
        </div>
      )}
    </div>
  );
};

const Content: FC<{ children: ReactElement; inputvalue: string }> = ({ children, inputvalue }) => {
  const childrenWithProps = cloneElement(children, { inputvalue });
  return <div className="discover-search-page-content-container">{childrenWithProps}</div>;
};

export { MaskDialog };
