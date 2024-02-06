import { FC, ReactElement } from 'react';
import './popUps.css';

const PopUps: FC<{ children: ReactElement }> = ({ children }) => {
  return <div className="pop-ups-container">{children}</div>;
};

export { PopUps };
