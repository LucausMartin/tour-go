import { FC } from 'react';
import './error.css';
import ErrorImage from '../../assets/404.png';

const Error: FC = () => {
  return (
    <div className="error-container">
      <img src={ErrorImage} alt="404" />
    </div>
  );
};

export { Error };
