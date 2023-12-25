import { FC } from 'react';
import { Link } from 'react-router-dom';

export function Component() {
  return <Register></Register>;
}

const Register: FC = () => {
  return (
    <div>
      <h1>Register</h1>
      <p>
        <Link to={'/'}>Home</Link>
      </p>
    </div>
  );
};
