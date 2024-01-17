import { FC } from 'react';
import './discover.css';
import { MdOutlineSearch } from 'react-icons/md';
import { ThemeButton } from '@components/ThemeButton/ThemeButton.tsx';

// const a = [...new Array(29).keys()];
// const webpPath = '/src/assets/img';

const Discover: FC = () => {
  return (
    <div className="discover-container">
      <DiscoverSearch></DiscoverSearch>
      <ThemeButton></ThemeButton>
      {/* <div className="discover-content">
        {a.map(item => {
          return <img key={item} src={`${webpPath}/${item + 1}.webp`} alt="1" />;
        })}
      </div> */}
    </div>
  );
};

const DiscoverSearch: FC = () => {
  return (
    <div className="discover-search-container">
      <input className="discover-search" placeholder="搜索旅游攻略" />
      <MdOutlineSearch className="discover-search-icon"></MdOutlineSearch>
    </div>
  );
};

export { Discover };
