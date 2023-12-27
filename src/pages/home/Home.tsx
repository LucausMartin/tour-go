import { FC } from 'react';
// import { useNavigate } from 'react-router-dom';
import './home.css';
import { NavigateBar } from './components/Navigate/Navigate.tsx';

export const Home: FC = () => {
  // const navigate = useNavigate();
  // const toLogin = () => {
  //   navigate('/login');
  // };
  return (
    <div className="home-container">
      {/* <button onClick={toLogin}>Register</button> */}
      {/* <div className="home-nav">nav</div> */}
      <NavigateBar />
      <main className="home-main">main</main>
    </div>
  );
};
