import { FC } from 'react';
import './discover.css';
import { MdOutlineSearch } from 'react-icons/md';

const a = [...new Array(200).keys()];

const Discover: FC = () => {
  return (
    <div className="discover-container">
      <DiscoverSearch></DiscoverSearch>
      {a.map(item => {
        return (
          <div key={item} style={{ width: '200px', height: '400px' }}>
            123
          </div>
        );
      })}
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
