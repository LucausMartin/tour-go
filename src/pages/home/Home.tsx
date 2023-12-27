import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: FC = () => {
  // throw new Error('test');
  const navigate = useNavigate();
  const toLogin = () => {
    navigate('/login');
  };
  const fetchInfo = () => {
    fetch(`/api/users`).then(res => {
      console.log(res);
    });
  };
  return (
    <div>
      <h1>Home{}</h1>
      <button onClick={toLogin}>Register</button>
      <button onClick={fetchInfo}>test Service Worker</button>
      <button>clean</button>
    </div>
  );
};
