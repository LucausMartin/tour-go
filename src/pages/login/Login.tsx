import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export function Component() {
  return <Login></Login>;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const toRegister = () => {
    navigate('/register');
  };
  return (
    <div>
      <h1>Login</h1>
      <Button onClick={toRegister}>Register</Button>
      <p>
        <Link to={'/'}>Home</Link>
      </p>
    </div>
  );
};
