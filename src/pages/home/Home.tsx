import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: FC = () => {
  // throw new Error('test');
  const navigate = useNavigate();
  const toLogin = () => {
    navigate('/login');
  };
  return (
    <div>
      <h1>Homee</h1>
      <button onClick={toLogin}>Register</button>
    </div>
  );
};
