import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Component() {
  return <Login></Login>;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const toRegister = () => {
    navigate('/register');
  };
  const fetchInfo = () => {
    fetch(`/api/users`).then(res => {
      console.log(res);
    });
  };
  return (
    <div>
      <h1>Login</h1>
      <button onClick={toRegister}>Register</button>
      <button onClick={fetchInfo}>test Service Worker</button>
      <p>
        <Link to={'/'}>Home</Link>
      </p>
    </div>
  );
};
