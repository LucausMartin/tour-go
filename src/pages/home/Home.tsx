import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import './home.css';
import { NavigateBar } from './components/Navigate/Navigate.tsx';

export const Home: FC = () => {
  return (
    <div className="home-container">
      <NavigateBar />
      <main className="home-main">
        <Outlet></Outlet>
      </main>
    </div>
  );
};
