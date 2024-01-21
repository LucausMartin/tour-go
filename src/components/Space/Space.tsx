import { FC } from 'react';

const Space: FC<{ width: string; height: string; display?: string }> = ({ width, height, display }) => {
  return <div style={{ width: width, height: height, display: display }}></div>;
};

export { Space };
