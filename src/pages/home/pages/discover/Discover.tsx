import { FC } from 'react';
import './discover.css';
import { MdOutlineSearch } from 'react-icons/md';

const Discover: FC = () => {
  return (
    <div className="discover-container">
      <DiscoverSearch></DiscoverSearch>
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
