import { FC } from 'react';
// import { useNavigate } from 'react-router-dom';
import './home.css';
import { useNavigate } from 'react-router-dom';
import { NavigateBar } from './components/Navigate/Navigate.tsx';
import { Button } from '@mui/material';

export const Home: FC = () => {
  const navigate = useNavigate();
  const navToLogin = () => {
    navigate('/login');
  };
  return (
    <div className="home-container">
      <NavigateBar />
      <main className="home-main">
        <Button onClick={navToLogin}>Login</Button>
      </main>
    </div>
  );
};
